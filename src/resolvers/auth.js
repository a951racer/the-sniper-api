import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User } from '../models/User'
import { AuthenticationError } from 'apollo-server-express'

export const authResolvers = {
  Query: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email })
      if (!user) throw new AuthenticationError('User does not exist!')

      const isEqual = await bcrypt.compare(password, user.password)
      if (!isEqual) throw new AuthenticationError('Password is incorrect!')

      if (!user.isValidated) throw new AuthenticationError('User hasn\'t been validated!')

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'somesupersecretkey',
        { expiresIn: '1h' }
      )

      console.log('returning: ', user.id, token)
      return { userId: user.id, isAdmin: user.isAdmin, token: token, tokenExpiration: 1 }
    }
  }
}