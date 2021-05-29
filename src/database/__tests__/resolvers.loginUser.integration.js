const firebase = require('firebase')
const TestDbServer = require('../../db-service/tests/test-db-server.js')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Mutation: { loginUser },
} = require('../resolvers')

jest.mock('firebase')

firebase.auth.GoogleAuthProvider.credential.mockReturnValue({
	providerId: 'testProvier',
})

describe('Resolvers Mutation loginUser', () => {
	it('should SUCCEED with token', async () => {
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

		const response = await loginUser(null, { accessToken: 'SOME_TOKEN' }, {})

		expect(response.user._id).toBeTruthy()
		expect(response.user.userId).toBe('my-test-user')
	})

	it('should create unique userId even for users with same name', async () => {
		firebase.auth.mockReturnValue({
			signInWithCredential: () => {
				return {
					user: {
						uid: 'uid1',
						displayName: 'test user',
					},
				}
			},
		})

		const response1 = await loginUser(null, { accessToken: 'SOME_TOKEN_1' }, {})

		firebase.auth.mockReturnValue({
			signInWithCredential: () => {
				return {
					user: {
						uid: 'uid2',
						displayName: 'test user',
					},
				}
			},
		})

		const response2 = await loginUser(null, { accessToken: 'SOME_TOKEN_2' }, {})

		expect(response1.user._id).toBeTruthy()
		expect(response1.user.userId).toBe('test-user')

		expect(response2.user._id).toBeTruthy()
		expect(response2.user.userId).toBe('test-user-1')
	})
})
