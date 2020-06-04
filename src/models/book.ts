import mongoose, { Document } from 'mongoose'
import { Book } from '../types/library'

export type BookDocument = Document & Book

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
  },
  description: String,
  publisher: String,
  isBorrowed: Boolean,
  publishedDate: Date,
  borrowDate: Date,
  returnDate: Date,
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
  ],
})

export default mongoose.model<BookDocument>('Book', bookSchema)
