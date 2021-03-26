require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const stocksRefresher = require('../StocksRefresher/index')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('refresh stocks', async () => {
		logger.info('stocks refresh job started')
		stocksRefresher()
	})

	await agenda.start()

	await agenda.every('10 minutes', 'refresh stocks')
}
