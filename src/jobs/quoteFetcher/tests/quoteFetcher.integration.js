require('../../../db-service/initialize')
const quoteFetcher = require('../index')
const { Stock } = require('../../../db-service/database/mongooseSchema')

jest.setTimeout(1200000)

describe('NewsFetcher', () => {
	it('integration test', async () => {
		await quoteFetcher()

		const aapl_history = await Stock.findOne({ symbol: 'TSLA' }, { price_history: 1 }).lean()

		// console.log('printing aapl_history', aapl_history)
	})
})
