const TopicCrawlerTrigger = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')

beforeAll(async () => {
	await dbConnection()
})

describe('TopicCrawlerTrigger integration', () => {
	it('Integration test', async () => {
		await TopicCrawlerTrigger(console, { IsPastDue: false })
	})
})
