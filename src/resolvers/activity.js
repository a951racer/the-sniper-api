import { Activity } from '../models/Activity'
import { AuthenticationError } from 'apollo-server-express'

export const activityResolvers = {
  Query: {
    activities: (parent, args, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      return Activity.find().populate('user').populate('activityType')
    }
  },

  Mutation: {
    createActivity: async (parent, { activity }, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      activity.user = context.userId
      let newActivity = new Activity(activity)
      await newActivity.save()
      newActivity = await Activity.findById(newActivity.id).populate('user').populate('activityType')
      return newActivity
    },

    updateActivity: async (parent, {id, activity}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const updatedActivity = await Activity.findByIdAndUpdate(id, activity, {new: true})
      return updatedActivity
    },

    deleteActivity: async (parent, {id}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const deletedActivity = await Activity.findByIdAndRemove(id)
      return deletedActivity
    }
  }
}