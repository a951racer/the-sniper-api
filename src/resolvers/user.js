import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import { AuthenticationError } from 'apollo-server-express'

export const userResolvers = {
  Query: {
    users: (parent, args, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')  // add isAdmin check
      return User.find()
    }
  },

  Mutation: {
    createUser: async (parent, { user }, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        console.error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(user.password, 12)
      const newUser = new User({
        ...user,
        password: hashedPassword
      })
      await newUser.save()
      return newUser
    },

    updateUser: async (parent, {id, user}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const updatedUser = await User.findByIdAndUpdate(id, user, {new: true})
      return updatedUser
    },

    deleteUser: async (parent, {id}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const deletedUser = await User.findByIdAndRemove(id)
      return deletedUser
    }
  }
}