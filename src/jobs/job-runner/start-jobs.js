require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const notificationChecker = require('../notification-checker')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('check notifications', async (job) => {
		logger.info('check notifications job started')
		notificationChecker()
	})

	await agenda.start()
	await agenda.every('30 minutes', 'check notifications')
}
