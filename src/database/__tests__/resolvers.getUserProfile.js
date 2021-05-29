const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { getUserProfile },
} = require('../resolvers')

describe('Resolvers Query getUserProfile', () => {
	it('should return User Profile with userId argument without userContext', async () => {
		const userId = 'getUserProfile-test-1'
		await User.create({ userId, firebaseUid: 'getUserProfile-firebaseUid-1' })
		const userProfile = await getUserProfile(null, { userId }, { userContext: null })

		expect(userProfile._id).toBeTruthy()
		expect(userProfile.userId).toBe(userId)
	})

	it('should return User Profile without userId argument and with userContext', async () => {
		const userId = 'getUserProfile-test-1'
		const user = await User.create({ userId, firebaseUid: 'getUserProfile-firebaseUid-1' })
		const userProfile = await getUserProfile(null, {}, { userContext: { _id: user._id } })

		expect(userProfile._id).toBeTruthy()
		expect(userProfile.userId).toBe(userId)
	})
})
