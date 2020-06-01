import { gql } from 'apollo-server-core'

export const AuthSchema = gql`
  
  extend type Query {
    login(email: String!, password: String!): AuthData!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
`
