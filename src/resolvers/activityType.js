import { ActivityType } from '../models/ActivityType'
import { AuthenticationError } from 'apollo-server-express'

export const activityTypeResolvers = {
  Query: {
    activityTypes: (parent, args, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      return ActivityType.find()
    }
  },

  Mutation: {
    createActivityType: async (parent, { activityType }, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const newActivityType = new ActivityType(activityType);
      await newActivityType.save()
      return newActivityType
    },
    updateActivityType: async (parent, {id, activityType}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const updatedActivityType = await ActivityType.findByIdAndUpdate(id, activityType, {new: true})
      return updatedActivityType
    },

    deleteActivityType: async (parent, {id}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const deletedActivityType = await ActivityType.findByIdAndRemove(id)
      return deletedActivityType
    }
  },
}
