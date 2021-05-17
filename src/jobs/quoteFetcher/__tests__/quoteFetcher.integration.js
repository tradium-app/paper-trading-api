const quoteFetcher = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')

jest.setTimeout(1200000)

beforeAll(async () => {
	await dbConnection()
})

describe('NewsFetcher', () => {
	it('integration test', async () => {
		await quoteFetcher()
	})
})
