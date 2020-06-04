import { Request, Response, NextFunction } from 'express'

import Author from '../models/Author'

import AuthorService from '../services/Author'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /Authors
export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName } = req.body
    const author = new Author({
      firstName,
      lastName,
    })
    const savedAuthor = await AuthorService.create(author)
    res.json(savedAuthor)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /Authors/:authorId
export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const authorId = req.params.authorId
    const updatedAuthor = await AuthorService.update(authorId, update)
    res.json(updatedAuthor)
  } catch (error) {
    next(new NotFoundError('Author not found', error))
  }
}

// DELETE /Authors/:authorId
export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await AuthorService.deleteAuthor(req.params.authorId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Author not found', error))
  }
}

// GET /Authors/:authorId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await AuthorService.findById(req.params.authorId))
  } catch (error) {
    next(new NotFoundError('Author not found', error))
  }
}

// GET /Authors
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await AuthorService.findAll())
  } catch (error) {
    next(new NotFoundError('Authors not found', error))
  }
}
