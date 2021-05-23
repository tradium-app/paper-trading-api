require('./config/env')

const morgan = require('morgan')
const express = require('express')
const timeout = require('connect-timeout')
const cors = require('cors')
const helmet = require('helmet')
const requireGraphQLFile = require('require-graphql-file')
const { ApolloServer, gql } = require('apollo-server-express')
require('./db-service/initialize')

const mongooseSchema = require('./db-service/database/mongooseSchema')
const resolvers = require('./database/resolvers')
const colors = require('colors/safe')
const Agenda = require('agenda')
const Agendash = require('agendash')
const GraphQlErrorLoggingPlugin = require('./config/graphql-error-logging')
require('./firebaseInit')
const authMiddlware = require('./auth-express-middleware')

const isDevelopment = process.env.NODE_ENV === 'development'

const app = express()

const corsOptionsDelegate = (req, callback) => {
	const origin = req.header('Origin')
	const allowedDomains = process.env.ALLOWED_DOMAINS.split(',')
	const isDomainAllowed = !origin || allowedDomains.some((a) => req.header('Origin').startsWith(a))

	callback(null, { origin: isDomainAllowed, credentials: true })
}
app.use(cors(corsOptionsDelegate))

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit')
var limiter = new RateLimit({
	windowMs: 10 * 1000,
	max: 5,
})
app.use(limiter)

app.use(authMiddlware)
app.use(timeout('30s'))
app.use((req, res, next) => {
	if (!req.timedout) {
		next()
	}
})
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))
app.use('/assets', express.static('assets'))

const agenda = new Agenda({ db: { address: process.env.DATABASE_READONLY_URL } })
app.use('/dash', Agendash(agenda))

const typeDefSchema = requireGraphQLFile('./database/typeDefs.graphql')
const typeDefs = gql(typeDefSchema)

const apolloServer = new ApolloServer({
	typeDefs: typeDefs,
	resolvers: resolvers,
	context: ({ req, res }) => ({
		userContext: req.userContext,
		req,
		res,
		...mongooseSchema,
	}),
	plugins: [GraphQlErrorLoggingPlugin],
})
apolloServer.applyMiddleware({ app, cors: false })

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	res.send({
		error: {
			message: err.message,
			stacktrace: isDevelopment ? err.stack : {},
		},
	})
})

app.listen(process.env.PORT, () => console.log(colors.rainbow(`Server running on http://localhost:${process.env.PORT}`)))
