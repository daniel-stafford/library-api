import express from 'express'
import passport from 'passport'

import {
  createUser,
  findById,
  deleteUser,
  findAll,
  updateUser,
  authenticate,
} from '../controllers/User'

const router = express.Router()

// Every path we define here will get /api/v1/Users prefix
router.post(
  '/google-authenticate',
  passport.authenticate('google-id-token'),
  authenticate
)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.get('/', findAll)
router.post('/', createUser)

export default router
