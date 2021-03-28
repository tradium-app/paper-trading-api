const path = require('path')
require('dotenv').config({
	path: path.join(__dirname, '../../../.env'),
})
require('../../firebaseInit.js')
const TestDbServer = require('../../db-service/tests/test-db-server.js')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Mutation: { loginUser },
} = require('../resolvers')

describe('Resolvers Mutation loginUser', () => {
	it('should FAIL with invalid token', async () => {
		expect.assertions(1)

		await loginUser(null, { accessToken: 'INVALID_TOKEN' }, {}).catch((error) => {
			expect(error).toBeInstanceOf(Error)
		})
	})
})
