import {
  UserState,
  UserActions,
  LOGIN_USER,
  LOGOUT_USER,
  BORROW_BOOK,
  RETURN_BOOK,
} from '../../types'

export default function user(
  state: UserState = {
    currentUser: {},
  },
  action: UserActions
): UserState {
  switch (action.type) {
    case LOGIN_USER: {
      return { ...state, currentUser: action.payload.currentUser }
    }
    case LOGOUT_USER: {
      return { ...state, currentUser: {} }
    }
    case BORROW_BOOK: {
      return {
        ...state,
        currentUser: action.payload,
      }
    }
    case RETURN_BOOK: {
      return {
        ...state,
        currentUser: action.payload,
      }
    }
    default:
      return state
  }
}
