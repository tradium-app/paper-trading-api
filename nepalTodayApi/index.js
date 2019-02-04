const { ApolloServer, gql } = require('apollo-server-azure-functions');
const fs = require('fs');
const resolvers = require('../src/database/resolvers.js');
const { newsDbService } = require('nepaltoday-db-service');

const isDevelopment = process.env.NODE_ENV === 'development';

// Construct a schema, using GraphQL schema language
const typeDefSchema = fs.readFileSync('./src/database/typeDefs.graphql', 'utf8');
const typeDefs = gql(typeDefSchema);

const server = new ApolloServer({ typeDefs, resolvers, context: newsDbService });

module.exports = server.createHandler();
