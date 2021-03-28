require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const stocksRefresher = require('../newsFetcher/index')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('Refresh stocks', async () => {
		logger.info('stocks refresh job started')
		stocksRefresher()
	})

	await agenda.start()

	await agenda.every('20 minutes', 'Refresh stocks')
}
