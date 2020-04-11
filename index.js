require('newrelic')
require('./src/config/env')
const morgan = require('morgan')
const express = require('express')
const helmet = require('helmet')
const requireGraphQLFile = require('require-graphql-file')
const mongoose = require('mongoose')
const { ApolloServer, gql } = require('apollo-server-express')
const mongooseSchema = require('./src/db-service/database/mongooseSchema')
const startJobs = require('./src/jobs/job-runner/start-jobs')
const resolvers = require('./src/database/resolvers')
const colors = require('colors/safe')
const Bearer = require('@bearer/node-agent')
const logger = require('./src/config/logger')

const isDevelopment = process.env.NODE_ENV === 'development'

Bearer.init({
	secretKey: process.env.BEARER_SH_API_KEY,
})

if (process.env.START_JOBS !== 'false') startJobs()

mongoose.promise = global.Promise
mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.catch((reason) => logger.error('mongo error: ', reason))

const app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))

const typeDefSchema = requireGraphQLFile('./src/database/typeDefs.graphql')
const typeDefs = gql(typeDefSchema)

const server = new ApolloServer({
	typeDefs: typeDefs,
	resolvers: resolvers,
	context: ({ req, res }) => ({
		...{ userContext: req.payload },
		...mongooseSchema,
	}),
})

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	res.send({
		error: {
			message: err.message,
			stacktrace: isDevelopment ? err.stack : {},
		},
	})
})

server.applyMiddleware({ app })

app.listen(process.env.PORT, () => console.log(colors.rainbow(`Server running on http://localhost:${process.env.PORT}`)))
