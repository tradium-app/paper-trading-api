const allStocksFetcher = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')
const path = require('path')
require('dotenv').config({
	path: path.join(__dirname, '../../../../.env'),
})

jest.setTimeout(1200000)

beforeAll(async () => {
	await dbConnection()
})

describe('All Stocks Fetcher', () => {
	it('integration test', async () => {
		await allStocksFetcher()
	})
})
