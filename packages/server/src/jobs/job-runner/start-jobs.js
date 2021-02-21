require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const crawler = require('../NewsCrawlerTrigger/index')
const notifier = require('../NotificationTrigger')
const twitterJob = require('../TwitterTrigger')
const newsChecker = require('../newsChecker')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('crawl articles', async () => {
		logger.info('crawl articles job started')
		crawler()
	})

	agenda.define('notify users', async () => {
		logger.info('notify users job started')
		notifier()
	})

	agenda.define('pull tweets', async () => {
		logger.info('pull tweets job started')
		twitterJob()
	})

	agenda.define('check news from sources', async () => {
		logger.info('checking news job started')
		newsChecker()
	})

	await agenda.start()

	await agenda.every('30 minutes', 'crawl articles')
	await agenda.every('5 minutes', 'notify users')
	await agenda.every('20 minutes', 'pull tweets')
	await agenda.every('24 hours', 'check news from sources')
}
