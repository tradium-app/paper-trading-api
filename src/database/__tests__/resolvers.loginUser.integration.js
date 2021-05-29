// require('dotenv').config()
const firebase = require('firebase')
const jwt = require('jsonwebtoken')
const TestDbServer = require('../../db-service/tests/test-db-server.js')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Mutation: { loginUser },
} = require('../resolvers')

jest.mock('firebase')

firebase.auth.mockReturnValue({
	signInWithCredential: () => {
		return {
			user: {
				uid: 'uid1',
				displayName: 'my test user',
			},
		}
	},
})
firebase.auth.GoogleAuthProvider.credential.mockReturnValue({
	providerId: 'testProvier',
})

describe('Resolvers Mutation loginUser', () => {
	it('should SUCCEED with token', async () => {
		const response = await loginUser(null, { accessToken: 'SOME_TOKEN' }, {})

		expect(response.user._id).toBeTruthy()
		expect(response.user.userId).toBe('my-test-user')
	})
})
