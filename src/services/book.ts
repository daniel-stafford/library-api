import Book, { BookDocument } from '../models/Book'
import User from '../models/User'
import Author, { AuthorDocument } from '../models/Author'
import {
  PageOptions,
  CreateBookPayload,
  Author as AuthorType,
  Book as BookType,
} from '../types/library'
import { clear } from 'winston'

async function create(payload: any): Promise<BookDocument> {
  const {
    title,
    isbn,
    authors,
    description,
    publisher,
    isBorrowed = false,
    publishedDate,
  } = payload

  if (!title || !isbn || !authors) {
    const error = new Error(`Book ${isbn} not found`)
    error.name = 'ValidationError'
    throw error //todoÖ figure out why I had to specify this a validation error.
  }

  function getAuthors(authors: AuthorType[]): Promise<AuthorDocument[]> {
    return Promise.all(
      authors.map(async (author: AuthorType) => {
        const { firstName, lastName } = author
        const existingAuthor = await Author.findOne({
          firstName,
          lastName,
        })

        if (!!existingAuthor) return existingAuthor
        return await new Author({ firstName, lastName }).save()
      })
    )
  }

  const authorsForNewBook = await getAuthors(authors)

  const book = await new Book({
    title,
    isbn,
    authors: authorsForNewBook.map(author => author._id),
    description,
    publisher,
    isBorrowed,
    publishedDate,
  }).save()

  function updateAuthors(authorsForNewBook: AuthorDocument[]) {
    return Promise.all(
      authorsForNewBook.map(async author => {
        author.books.push(book)
        author.save()
      })
    )
  }

  updateAuthors(authorsForNewBook)

  return (await Book.findById(book._id).populate('authors', {
    firstName: 1,
    lastName: 1,
  })) as BookDocument
}

function findByIsbn(isbn: number): Promise<BookDocument> {
  return Book.findOne({ isbn })
    .exec() // .exec() will return a true Promise
    .then(book => {
      if (!book) {
        throw new Error(`Book ${isbn} not found`)
      }
      return book
    })
}

function findAll(pageOptions: PageOptions): Promise<BookDocument[]> {
  return Book.find()
    .sort({ title: 1, publishedYear: -1 })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .populate('authors', { firstName: 1, lastName: 1 })
    .exec()
}

async function filter(filterObj: any): Promise<BookDocument[]> {
  const { searchField, searchTerm } = filterObj
  if (searchField === 'title') {
    return Book.find({ title: { $regex: `${searchTerm}` } }).exec()
  }
  if (searchField === 'isborrowed') {
    return Book.find({ isBorrowed: searchTerm }).exec()
  } else throw new Error('Invalid filter term')
}

function update(
  bookId: string,
  update: Partial<BookDocument>
): Promise<BookDocument> {
  return Book.findById(bookId)
    .exec()
    .then(book => {
      if (!book) {
        throw new Error(`Book ${bookId} not found`)
      }
      if (update.title) {
        book.title = update.title
      }
      if (update.isbn) {
        book.isbn = update.isbn
      }
      if (update.description) {
        book.description = update.description
      }
      if (update.publisher) {
        book.publisher = update.publisher
      }
      if (update.authors) {
        book.authors = update.authors
      }
      if (update.categories) {
        book.categories = update.categories
      }
      // Add more fields here if needed
      return book.save()
    })
}

function deleteBook(bookId: string): Promise<BookDocument | null> {
  return Book.findByIdAndDelete(bookId).exec()
}
function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
} //todo: move this to util function

async function lendBook(
  bookId: BookType,
  userId: string
): Promise<BookDocument> {
  const user = await User.findById(userId)
  const book = await Book.findById(bookId)
  if (!user) {
    throw new Error(`user ${userId} not found`)
  }
  if (!book) {
    throw new Error(`book ${bookId} not found`)
  }
  if (book.isBorrowed) {
    throw new Error(`book ${bookId} is already borrowed`)
  }
  user.borrowedBooks.push(bookId)
  user.save()
  book.isBorrowed = true
  book.borrowDate = new Date()
  book.returnDate = addDays(new Date(), 14)
  return book.save()
}

async function returnBook(
  bookId: BookType,
  userId: string
): Promise<BookDocument> {
  const user = await User.findById(userId)
  const book = await Book.findById(bookId)
  if (!user) {
    throw new Error(`user ${userId} not found`)
  }
  if (!book) {
    throw new Error(`book ${bookId} not found`)
  }
  if (!book.isBorrowed) {
    throw new Error(`book ${bookId} is not borrowed`)
  }

  user.borrowedBooks = user.borrowedBooks.filter(id => id != bookId)
  user.save()
  book.isBorrowed = false
  book.borrowDate = null
  book.returnDate = null
  return book.save()
}
export default {
  create,
  findByIsbn,
  findAll,
  update,
  deleteBook,
  lendBook,
  returnBook,
  filter,
}
