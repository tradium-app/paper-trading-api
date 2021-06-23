require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const quoteFetcher = require('../quoteFetcher')
const gameCreator = require('../gameCreator')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('Quote Fetcher', async () => {
		logger.info('stocks refresh job started')
		quoteFetcher()
	})

	agenda.define('Game Creator', async () => {
		logger.info('Game Creator job started')
		gameCreator()
	})

	await agenda.start()
	await agenda.every('0 4 * * 1-5', 'Quote Fetcher')
	await agenda.every('0 9 * * 1-5', 'Game Creator')
}
