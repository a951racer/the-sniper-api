import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { typeDefs } from './schema'
import resolvers from './resolvers'

const startServer = async () => {
  const app = express()
  
    const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        return { userId: null, isAuth: false};
      }
      const token = authHeader.split(' ')[1];
      if (!token || token === '') {
        return { userId: null, isAuth: false};
      }
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');
      } catch (err) {
        return { userId: null, isAuth: false};
      }
      if (!decodedToken) {
        return { userId: null, isAuth: false};
      }
      return { userId: decodedToken.userId, isAuth: true};
    }
  })

  server.applyMiddleware({ app });

  await mongoose.connect('mongodb://localhost:27017/sniper', {useNewUrlParser: true, useUnifiedTopology: true});

  app.listen({ port: 5000 }, () =>
    console.log(`Server ready at http://localhost:5000${server.graphqlPath}`)
  )
}

startServer()