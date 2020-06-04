import mongoose, { Document } from 'mongoose'
import { User } from '../types/library'

export type UserDocument = Document & User

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: String,
  isAdmin: Boolean,
  password: String, //save as hashed string
  borrowedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      // required: true,
      index: true,
    },
  ],
})

export default mongoose.model<UserDocument>('User', userSchema)
