import mongoose, { Document } from 'mongoose'
import { Author } from '../types/library'

export type AuthorDocument = Document & Author

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      // required: true,
      index: true,
    },
  ],
})

export default mongoose.model<AuthorDocument>('Author', authorSchema)
