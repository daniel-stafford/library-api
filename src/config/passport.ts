import passport from 'passport'

import UserServices from '../services/user'
import User from '../models/User'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GoogleTokenStrategy = require('passport-google-id-token')

const GOOGLE_CLIENT_ID =
  '118090390095-4ulgncep5ef9maik9p3jffav5e7ah4s8.apps.googleusercontent.com'

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
    },
    async function(parsedToken: any, googleId: string, done: any) {
      const { payload } = parsedToken
      try {
        const user = await User.findOne({ email: payload.email }).populate(
          'borrowedBooks'
        )
        if (user) {
          return done(null, user) //
        }
        const newUser = new User({
          firstName: payload.given_name,
          lastName: payload.family_name,
          email: payload.email,
          avatar: payload.picture,
          isAdmin: payload.email === 'daniel.stafford@integrify.io',
        })
        await UserServices.create(newUser)
        done(null, newUser) //gives us req.user
      } catch (error) {
        done(error)
      }
    }
  )
)
