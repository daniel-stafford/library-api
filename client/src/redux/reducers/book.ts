import { FETCH_BOOKS, BookState, BookActions, CREATE_BOOK } from '../../types'

export default function book(
  state: BookState = {
    allBooks: [],
  },
  action: BookActions
): BookState {
  switch (action.type) {
    case FETCH_BOOKS: {
      return { ...state, allBooks: action.payload }
    }
    case CREATE_BOOK: {
      return { ...state, allBooks: state.allBooks.concat(action.payload) }
    }
    default:
      return state
  }
}
