import React from 'react'
import Button from '@material-ui/core/Button'
import { useSelector, useDispatch } from 'react-redux'
import { List, ListItem } from '@material-ui/core'

import { returnBookApi } from '../redux/actions'
import { AppState } from '../types'

export default function MyLoans() {
  const dispatch = useDispatch()
  const userId = useSelector((state: AppState) => state.user.currentUser._id)

  const loans = useSelector(
    (state: AppState) => state.user.currentUser.borrowedBooks
  )
  const handleClick: any = (bookId: string) => {
    userId &&
      dispatch(
        returnBookApi(
          {
            bookId,
            userId,
          },
          userId
        )
      )
  }
  return (
    <>
      <h1>My loans</h1>
      <List>
        {loans &&
          loans.map(loan => (
            <ListItem key={loan.title}>
              {' '}
              {loan.title} Due Date: {loan.returnDate}{' '}
              <Button
                onClick={() => handleClick(loan._id)}
                color="secondary"
                disabled={loan.isBorrowed ? false : true}
              >
                Return
              </Button>
            </ListItem>
          ))}
      </List>
    </>
  )
}
