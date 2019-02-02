import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import fs from 'fs';

import resolvers from './src/database/resolvers.js';
import { newsDbService } from 'nepaltoday-db-service';

const isDevelopment = process.env.NODE_ENV === 'development';

// Construct a schema, using GraphQL schema language
const typeDefSchema = fs.readFileSync('./src/database/typeDefs.graphql', 'utf8');
const typeDefs = gql(typeDefSchema);

const server = new ApolloServer({ typeDefs, resolvers, context: newsDbService });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
