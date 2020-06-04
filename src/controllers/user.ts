import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '../util/secrets'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import UserService from '../services/User'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /Users
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email } = req.body
    const user = new User({
      firstName,
      lastName,
      email,
      borrowedBooks: [],
      isAdmin: email === process.env.ADMIN_EMAIL,
    })

    await UserService.create(user)
    res.json(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /Users/:userId
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updatedUser = await UserService.update(userId, update)
    res.json(updatedUser)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// DELETE /Users/:userId
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /Users/:authorId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await await await UserService.findById(req.params.userId))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /Users
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAll())
  } catch (error) {
    next(new NotFoundError('Users not found', error))
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      email,
      isAdmin,
      id,
      avatar,
      borrowedBooks,
    } = req.user as any
    const token = await jwt.sign(
      {
        firstName,
        email,
        isAdmin,
        id,
        avatar,
        borrowedBooks,
      },
      JWT_SECRET,
      {
        expiresIn: '48h',
      }
    )
    res.json({ token, isAdmin, firstName, email, borrowedBooks, _id: id })
  } catch (error) {
    return next(new InternalServerError())
  }
}
