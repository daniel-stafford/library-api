import { Dispatch } from 'redux'

import { FETCH_BOOKS, BookActions, Book, CREATE_BOOK } from '../../types'
import { getAllBooksAxios, createBookAxios } from '../../../src/services/axios'

export function fetchBooks(allBooks: Book[]): BookActions {
  return {
    type: FETCH_BOOKS,
    payload: allBooks,
  }
}
export function fetchBooksApi() {
  return async (dispatch: Dispatch) => {
    const { data } = await getAllBooksAxios()
    return dispatch(fetchBooks(data))
  }
}

export function createBook(book: any): BookActions {
  return {
    type: CREATE_BOOK,
    payload: book,
  }
}

export function createBookApi(payload: any) {
  return async (dispatch: Dispatch) => {
    const res = await createBookAxios(payload)
    return dispatch(createBook(res.data))
  }
}
