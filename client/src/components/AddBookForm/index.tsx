import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { createBookApi } from '../../redux/actions'

export default function Form() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [authorFirstName, setAuthorFirstName] = useState('')
  const [authorLastName, setAuthorLastName] = useState('')
  const [isbn, setIsbn] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const payload = {
      title,
      authors: [{ firstName: authorFirstName, lastName: authorLastName }],
      isbn,
    }
    dispatch(createBookApi(payload))
    setDisabled(true)
    setTimeout(function() {
      setIsSubmitted(true)
    }, 1000)
  }
  return (
    <>
      {isSubmitted && <Redirect to="/books" />} <h1>Add new book</h1>
      <form onSubmit={e => handleSubmit(e)}>
        <TextField
          id="title"
          name="title"
          label="Title"
          fullWidth
          onChange={e => setTitle(e.target.value)}
          required
        />
        <TextField
          id="AuthorFirstName"
          name="AuthorFirstName"
          label="Author's first name"
          fullWidth
          onChange={e => setAuthorFirstName(e.target.value)}
          required
        />
        <TextField
          id="AuthorsLastName"
          name="AuthorsLastName"
          label="Author's last name"
          fullWidth
          onChange={e => setAuthorLastName(e.target.value)}
        />
        <TextField
          id="isbn"
          name="isbn"
          label="ISBN"
          fullWidth
          onChange={e => setIsbn(e.target.value)}
          required
          type="number"
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginTop: '30px' }}
          disabled={disabled}
        >
          Submit
        </Button>
      </form>
    </>
  )
}
