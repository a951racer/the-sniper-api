import { gql } from 'apollo-server-core'

export const NoteSchema = gql`
  
  extend type Query {
    notes: [Note!]!
  }

  extend type Mutation {
    createNote(note: NoteInput!): Note
    updateNote(id: ID!, note: NoteInput!): Note
    deleteNote(id: ID!): Note
  }

  type Note {
    id: ID!
    noteDate: Date!
    note: String!
    links: [String!],
    files: [String!],
    opportunity: Opportunity
    created: Date
    lastUpdated: Date
    user: User
  }

  input NoteInput {
    noteDate: String!
    note: String!
    links: [String!],
    files: [String!],
    opportunity: OpportunityInput
  }
`
