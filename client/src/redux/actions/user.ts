import { Dispatch } from 'redux'

import {
  LOGIN_USER,
  LOGOUT_USER,
  BORROW_BOOK,
  UserActions,
  CurrentUser,
  RETURN_BOOK,
  User,
} from '../../types'
import {
  borrowBookAxios,
  returnBookAxios,
  getUserById,
} from '../../services/axios'

export function loginUser(currentUser: CurrentUser): UserActions {
  return {
    type: LOGIN_USER,
    payload: {
      currentUser,
    },
  }
}

export function logoutUser(): UserActions {
  return {
    type: LOGOUT_USER,
  }
}

export function borrowBook(user: User): UserActions {
  return {
    type: BORROW_BOOK,
    payload: user,
  }
}

export function borrowBookApi(payload: any, userId: string) {
  return async (dispatch: Dispatch) => {
    await borrowBookAxios(payload)
    const res = await getUserById(userId)
    return dispatch(borrowBook(res.data))
  }
}

export function returnBook(user: User): UserActions {
  return {
    type: RETURN_BOOK,
    payload: user,
  }
}

export function returnBookApi(payload: any, userId: string) {
  return async (dispatch: Dispatch) => {
    await returnBookAxios(payload)
    const res = await getUserById(userId)
    return dispatch(returnBook(res.data))
  }
}
