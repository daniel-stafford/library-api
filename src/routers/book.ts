import express from 'express'

import {
  createBook,
  findByIsbn,
  deleteBook,
  findAll,
  updateBook,
  lendBook,
  returnBook,
  filter,
} from '../controllers/Book'

const router = express.Router()

// Every path we define here will get /api/v1/Books prefix
router.get('/', findAll)
router.get('/book-filter', filter)
router.put('/book-lend', lendBook)
router.put('/book-return', returnBook)
router.get('/:isbn', findByIsbn)
router.put('/:bookId', updateBook)
router.delete('/:bookId', deleteBook)
router.post('/', createBook)

export default router
