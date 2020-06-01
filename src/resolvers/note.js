import { Note } from '../models/Note'
import { AuthenticationError } from 'apollo-server-express'

export const noteResolvers = {
  Query: {
    notes: (parent, args, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      return Note.find().populate('user').populate('contacts')
    }
  },

  Mutation: {
    createNote: async (parent, { note }, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      note.user = context.userId
      let newNote = new Note(note)
      await newNote.save()
      newNote = await Note.findById(newNote.id).populate('user')
      return newNote
    },

    updateNote: async (parent, {id, note}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const updatedNote = await Note.findByIdAndUpdate(id, note, {new: true})
      return updatedNote
    },

    deleteNote: async (parent, {id}, context) => {
      if (!context.isAuth) throw new AuthenticationError('you must be logged in')
      const deletedNote = await Note.findByIdAndRemove(id)
      return deletedNote
    }
  }
}