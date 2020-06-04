import {
  connection,
  clearDatabase,
  closeDatabase,
} from '../../src/helpers/dbHelper'
import User from '../../src/models/User'
import BookService from '../../src/services/book'
import Author from '../../src/models/Author'
import Book from '../../src/models/Book'

const nonExistingBookIsbn = 12343244423
const nonExistingBookId = '12343244423'

const UserPageOptions = {
  page: 1,
  limit: 1,
}

const NoPagination = {
  page: 0,
  limit: 1e6,
}

async function createBook() {
  const payload = {
    authors: [{ firstName: 'Charles', lastName: 'Dickens' }],
    title: 'Tale of Two Cities',
    isbn: 333333323,
  }
  return await BookService.create(payload)
}

async function createAnotherBook() {
  const payload = {
    authors: [{ firstName: 'Charles', lastName: 'Dickens' }],
    title: 'Hello Pradeep',
    isbn: 333333323,
  }
  return await BookService.create(payload)
}

async function createThirdBook() {
  const payload = {
    authors: [{ firstName: 'Charles', lastName: 'Dickens' }],
    title: 'Hello Pradeep',
    isbn: 333333323,
  }
  return await BookService.create(payload)
}

async function createUser() {
  const user = new User({
    firstName: 'Mikko',
    lastName: 'Mikkonen',
    email: 'Mikko@gmail.com',
  })
  return user.save()
}

async function createAnotherUser() {
  const user = new User({
    firstName: 'Lauri',
    lastName: 'Pekkonen',
    email: 'Lauri@gmail.com',
  })
  return user.save()
}

describe('book service', () => {
  beforeEach(async () => {
    await connection()
  })
  afterEach(async () => {
    await clearDatabase()
  })
  afterAll(async () => {
    await closeDatabase()
  })
  it('should create a book with an ID, title, and author(s)', async () => {
    const savedBook = await createBook()
    expect(savedBook).toHaveProperty('_id')
    expect(savedBook).toHaveProperty('title', 'Tale of Two Cities')
    expect(savedBook.authors).toHaveLength(1)
  })

  it('should create a new author if they do not already exist', async () => {
    const savedBook = await createBook()
    expect(Author.findById(savedBook.authors[1])).toBeTruthy
  })

  it('should get a book by ISBN', async () => {
    const savedBook = await createBook()
    const found = await BookService.findByIsbn(savedBook.isbn)
    expect(found.title).toEqual(savedBook.title)
    expect(found._id).toEqual(savedBook._id)
  })

  it('should not get a non-existing book', async () => {
    expect.assertions(1)
    return BookService.findByIsbn(nonExistingBookIsbn).catch(e => {
      expect(e.message).toMatch(`Book ${nonExistingBookIsbn} not found`)
    })
  })
  it('should return all books with pagination', async () => {
    await createBook()
    await createAnotherBook()
    await createThirdBook()
    const response = await BookService.findAll(UserPageOptions)
    expect(response).toHaveLength(1)
  })
  it('should return all books without pagination', async () => {
    await createBook()
    await createAnotherBook()
    await createThirdBook()
    const response = await BookService.findAll(NoPagination)
    expect(response).toHaveLength(3)
  })
  it('should delete an existing book', async () => {
    const savedBook = await createBook()
    await BookService.deleteBook(savedBook._id)
    return BookService.findByIsbn(savedBook.isbn).catch(e => {
      expect(e.message).toMatch(`Book ${savedBook.isbn} not found`)
    })
  })
  it('should filter books by title', async () => {
    await createBook()
    createAnotherBook()
    const response = await BookService.filter({
      searchField: 'title',
      searchTerm: 'Two',
    })
    expect(response).toHaveLength(1)
  })
  it('should filter books by availability', async () => {
    const savedBook = await createBook()
    const user = await createUser()
    await BookService.lendBook(savedBook._id, user._id)
    await createAnotherBook()
    const response = await BookService.filter({
      searchField: 'isborrowed',
      searchTerm: true,
    })
    expect(response).toHaveLength(1)
  })

  it('should throw an error when deleting a non-existing book', async () => {
    return BookService.deleteBook(nonExistingBookId).catch(e => {
      expect(e).toThrow //ToDO: FIX ERROR MESSAGE!!
    })
  })
  it('should be able to lend an available book to a user', async () => {
    const savedBook = await createBook()
    const user = await createUser()
    expect(await Book.findById(savedBook._id)).toHaveProperty(
      'isBorrowed',
      false
    )
    await BookService.lendBook(savedBook._id, user._id)
    expect(await Book.findById(savedBook._id)).toHaveProperty(
      'isBorrowed',
      true
    )
    const updatedUser = (await User.findById(user._id)) as any //todo: Fix this explicit any
    expect(updatedUser.borrowedBooks).toHaveLength(1)
  })

  it('should not be able to lend a borrowed book to a user', async () => {
    expect.assertions(1)
    const savedBook = await createBook()
    const user = await createUser()
    await BookService.lendBook(savedBook._id, user._id)
    const anotherUser = await createAnotherUser()
    return BookService.lendBook(savedBook._id, anotherUser._id).catch(e => {
      expect(e.message).toContain('already borrowed')
    })
  })
  it('should be able to return a borrowed book to the library', async () => {
    const savedBook = await createBook()
    const user = await createUser()
    await BookService.lendBook(savedBook._id, user._id)
    expect(await Book.findById(savedBook._id)).toHaveProperty(
      'isBorrowed',
      true
    )
    const userWithBook: any = await User.findById(user._id)
    expect(userWithBook.borrowedBooks).toHaveLength(1)
    await BookService.returnBook(savedBook._id, user._id)
    expect(await Book.findById(savedBook._id)).toHaveProperty(
      'isBorrowed',
      false
    )
  })
})
