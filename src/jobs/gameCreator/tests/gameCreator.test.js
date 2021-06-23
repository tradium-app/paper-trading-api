const TestDbServer = require('../../../db-service/tests/test-db-server.js')
const { Stock } = require('../../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const GameCreatorJob = require('../index')

describe('game creator', () => {
	it('should create games based on stock price', async () => {
		await GameCreatorJob()
	})
})
