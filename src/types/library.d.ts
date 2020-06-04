export type Book = {
  title: string
  isbn: number
  authors: Author[]
  description: string
  categories: string[]
  publisher: string
  isBorrowed: boolean
  borrower: User
  publishedDate: Date | null
  borrowDate: Date | null
  returnDate: Date | null
}

export type Author = { firstName: string; lastName: string; books: Book[] }

export type User = {
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
  borrowedBooks: Book[]
}

export type PageOptions = {
  page: number
  limit: number
}

export type CreateBookPayload = {
  title: string
  isbn: number
  authors: Author[]
  description?: string
  publisher?: string
  isBorrowed: boolean
  publishedDate?: Date
}
