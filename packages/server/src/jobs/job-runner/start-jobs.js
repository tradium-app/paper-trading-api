require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const newsFetcher = require('../newsFetcher')
const quoteFetcher = require('../quoteFetcher')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('Refresh stock news', async () => {
		logger.info('stocks refresh job started')
		newsFetcher()
	})

	agenda.define('Refresh stock quote', async () => {
		logger.info('stocks refresh job started')
		quoteFetcher()
	})

	await agenda.start()

	await agenda.every('30 minutes', 'Refresh stock news')
	await agenda.every('*/20 9-5 * * 1-5', 'Refresh stock quote')
}
