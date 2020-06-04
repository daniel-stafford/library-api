import Author, { AuthorDocument } from '../models/Author'

function create(author: AuthorDocument): Promise<AuthorDocument> {
  return author.save()
}

function findById(authorId: string): Promise<AuthorDocument> {
  return Author.findById(authorId)
    .exec() // .exec() will return a true Promise
    .then(author => {
      if (!author) {
        throw new Error(`author ${authorId} not found`)
      }
      return author
    })
}

function findAll(): Promise<AuthorDocument[]> {
  return Author.find()
    .populate('books', { title: 1 })
    .sort({ lastName: 1 })
    .exec() // Return a Promise
}

function update(
  authorId: string,
  update: Partial<AuthorDocument>
): Promise<AuthorDocument> {
  return Author.findById(authorId)
    .exec()
    .then(author => {
      if (!author) {
        throw new Error(`Author ${authorId} not found`)
      }

      if (update.firstName) {
        author.firstName = update.firstName
      }

      if (update.lastName) {
        author.lastName = update.lastName
      }
      // Add more fields here if needed
      return author.save()
    })
}

function deleteAuthor(authorId: string): Promise<AuthorDocument | null> {
  return Author.findByIdAndDelete(authorId).exec()
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteAuthor,
}
