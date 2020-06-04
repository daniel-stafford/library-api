// Action types
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT'
export const TOGGLE_DIALOG = 'TOGGLE_DIALOG'
export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const FETCH_BOOKS = 'FETCH_BOOKS'
export const FILTER_BOOKS = 'FILTER_BOOKS'
export const CREATE_BOOK = 'CREATE_BOOK'
export const BORROW_BOOK = 'BORROW_BOOK'
export const RETURN_BOOK = 'RETURN_BOOK'

// Enum
export enum DialogType {
  SignIn = 'signIn',
  SignUp = 'signUp',
}

// A product
export type Product = {
  id: string
  name: string
  price: number
}

export type CurrentUser = {
  _id?: string
  firstName?: string
  isAdmin?: boolean
  borrowedBooks?: Book[]
}

export type Book = {
  title: string
  isbn: number
  authors: Author[]
  description?: string
  categories?: string[]
  publisher?: string
  isBorrowed?: boolean
  _id: string
  borrower?: User
  publishedDate?: Date | null
  borrowDate?: Date | null
  returnDate?: Date | null
}

export type token = string

export type Author = { firstName: string; lastName: string; books: Book[] }

export type User = {
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
  borrowedBooks: Book[]
}

export type FetchBooksAction = {
  type: typeof FETCH_BOOKS
  payload: Book[]
}

export type CreateBookAction = {
  type: typeof CREATE_BOOK
  payload: Book
}

export type BorrowBookAction = {
  type: typeof BORROW_BOOK
  payload: User
}

export type ReturnBookAction = {
  type: typeof RETURN_BOOK
  payload: User
}

export type FilterBooksAction = {
  type: typeof FILTER_BOOKS
  payload: string
}

export type AddProductAction = {
  type: typeof ADD_PRODUCT
  payload: {
    product: Product
  }
}

export type LoginUserAction = {
  type: typeof LOGIN_USER
  payload: {
    currentUser: CurrentUser
  }
}

export type LogoutUserAction = {
  type: typeof LOGOUT_USER
}

export type RemoveProductAction = {
  type: typeof REMOVE_PRODUCT
  payload: {
    product: Product
  }
}

export type ToggleDialogAction = {
  type: typeof TOGGLE_DIALOG
  payload: {
    dialog: DialogType
  }
}

export type UiActions = ToggleDialogAction
export type BookActions =
  | FetchBooksAction
  | FilterBooksAction
  | CreateBookAction

export type ProductActions = AddProductAction | RemoveProductAction
export type UserActions =
  | LoginUserAction
  | LogoutUserAction
  | BorrowBookAction
  | ReturnBookAction
export type ProductState = {
  inCart: Product[]
}

// Using dynamic keys from an enum
export type UiState = {
  dialogOpen: {
    [key in DialogType]?: boolean
  }
}

export type UserState = {
  currentUser: CurrentUser
}

export type BookState = {
  allBooks: Book[]
}

export type AppState = {
  product: ProductState
  ui: UiState
  book: BookState
  user: UserState
}
