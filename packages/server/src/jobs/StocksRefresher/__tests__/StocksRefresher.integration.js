const StocksRefresher = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')

jest.setTimeout(1200000)

beforeAll(async () => {
	await dbConnection()
})

describe('StocksRefresher', () => {
	it('integration test', async () => {
		await StocksRefresher()
	})
})
