import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import useBooks from '../hooks/useBooks'
import { borrowBookApi, fetchBooksApi } from '../redux/actions'
import { AppState } from '../types'

export default function Books() {
  const allBooks = useSelector((state: AppState) => state.book.allBooks)
  useBooks()
  const userId = useSelector((state: AppState) => state.user.currentUser._id)
  const { borrowedBooks } = useSelector(
    (state: AppState) => state.user.currentUser
  )
  const dispatch = useDispatch()
  const handleClick: any = (bookId: string) => {
    userId &&
      dispatch(
        borrowBookApi(
          {
            bookId,
            userId,
          },
          userId
        )
      )
    dispatch(fetchBooksApi)
  }

  const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  })

  const classes = useStyles()

  return (
    <>
      <ul>
        {allBooks.map(book => (
          <Card key={book.title} className={classes.root}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {book.title}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {book.authors.map(
                  author => author.firstName + ' ' + author.lastName
                )}
              </Typography>
              <Typography variant="body2" component="p">
                {book.isbn}
                <br />
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                disabled={
                  book.isBorrowed ||
                  borrowedBooks?.find(b => b._id === book._id)
                    ? true
                    : false
                }
                onClick={() => handleClick(book._id)}
              >
                Borrow
              </Button>
            </CardActions>
          </Card>
        ))}
      </ul>
    </>
  )
}
