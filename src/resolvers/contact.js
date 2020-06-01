import { Contact } from '../models/Contact'
import { AuthenticationError } from 'apollo-server-express'

export const contactResolvers = {
  Query: {
    contacts: (parent, args, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      return Contact.find().populate('user')
    }
  },

  Mutation: {
    createContact: async (parent, { contact }, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      contact.user = context.userId
      let newContact = new Contact(contact)
      await newContact.save()
      newContact = await Contact.findById(newContact.id).populate('user')
      return newContact
    },

    updateContact: async (parent, {id, contact}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const updatedContact = await Contact.findByIdAndUpdate(id, contact, {new: true})
      return updatedContact
    },

    deleteContact: async (parent, {id}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const deletedContact = await Contact.findByIdAndRemove(id)
      return deletedContact
    }
  }
}