require('dotenv').config()
const mongoose = require('mongoose')
const logger = require('../config/logger')

mongoose.promise = global.Promise
mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
		autoIndex: true,
	})
	.catch((error) => logger.error('mongo error: ', error))
