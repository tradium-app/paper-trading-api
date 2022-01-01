require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const quoteFetcher = require('../quoteFetcher')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('Quote Fetcher', async () => {
		logger.info('stocks refresh job started')
		quoteFetcher()
	})

	await agenda.start()
	await agenda.every('0 4 * * 1-5', 'Quote Fetcher')
}
