require('../../../db-service/initialize')
const { Stock } = require('../../../db-service/database/mongooseSchema')
const GameCreatorJob = require('../index')

jest.setTimeout(1200000)

describe('game creator', () => {
	it('should create games based on stock price', async () => {
		await GameCreatorJob()
	})
})
