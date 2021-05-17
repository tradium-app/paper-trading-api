require('./config/env')
const Bearer = require('@bearer/node-agent')
require('./db-service/initialize')

Bearer.init({
	secretKey: process.env.BEARER_SH_API_KEY,
	stripSensitiveData: true,
	environment: process.env.BEARER_SH_ENV || process.env.NODE_ENV,
})
