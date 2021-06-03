require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const notificationChecker = require('../notification-checker')
const computeTrendingTags = require('../compute-trending-tags')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('check notifications', async (job) => {
		logger.info('check notifications job started')
		notificationChecker()
	})

	agenda.define('compute trending tags', async (job) => {
		logger.info('compute trending tags started')
		computeTrendingTags()
	})

	await agenda.start()
	await agenda.every('30 minutes', 'check notifications')
	await agenda.every('4 hours', 'compute trending tags')
}
