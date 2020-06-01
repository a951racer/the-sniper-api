import { Opportunity } from '../models/Opportunity'
import { AuthenticationError } from 'apollo-server-express'

export const opportunityResolvers = {
  Query: {
    opportunities: (parent, args, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      return Opportunity.find().populate('user')
    }
  },

  Mutation: {
    createOpportunity: async (parent, { opportunity }, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      opportunity.user = context.userId
      let newOpportunity = new Opportunity(opportunity)
      await newOpportunity.save()
      newOpportunity = await Opportunity.findById(newOpportunity.id).populate('user')
      return newOpportunity
    },

    updateOpportunity: async (parent, {id, opportunity}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const updatedOpportunity = await Opportunity.findByIdAndUpdate(id, opportunity, {new: true})
      return updatedOpportunity
    },

    deleteOpportunity: async (parent, {id}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const deletedOpportunity = await Opportunity.findByIdAndRemove(id)
      return deletedOpportunity
    }
  }
}