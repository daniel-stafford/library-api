import { Request, Response, NextFunction } from 'express'

import BookService from '../services/Book'

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /Books
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createBook = await BookService.create(req.body)
    res.json(createBook)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /Books/:bookId
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const bookId = req.params.bookId
    const updatedBook = await BookService.update(bookId, update)
    res.json(updatedBook)
  } catch (error) {
    next(new NotFoundError('Book not found', error))
  }
}

// DELETE /Books/:bookId
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await BookService.deleteBook(req.params.bookId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Book not found', error))
  }
}

// GET /Books/:isbn
export const findByIsbn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await BookService.findByIsbn(Number(req.params.isbn)))
  } catch (error) {
    next(new NotFoundError('Book not found', error))
  }
}

// GET /Books
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 1e6,
    }
    res.json(await BookService.findAll(pageOptions))
  } catch (error) {
    next(new NotFoundError('Books not found', error))
  }
}

// GET /Books
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filterObj = {
      searchField: req.body.searchField.toLowerCase(),
      searchTerm: req.body.searchTerm,
    }
    res.json(await BookService.filter(filterObj))
  } catch (error) {
    next(new NotFoundError('Books not found', error))
  }
}

export const lendBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId, userId } = req.body
    res.json(await BookService.lendBook(bookId, userId))
  } catch (error) {
    next(new NotFoundError('Book or User not found', error))
  }
}

export const returnBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId, userId } = req.body
    res.json(await BookService.returnBook(bookId, userId))
  } catch (error) {
    next(new NotFoundError('Book or User not found', error))
  }
}
