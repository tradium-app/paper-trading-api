const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { getUserProfile },
} = require('../resolvers')

describe('Resolvers Query getUserProfile', () => {
	it('should return User Profile with userUrlId argument without userContext', async () => {
		const userUrlId = 'getUserProfile-test-1'
		await User.create({ userUrlId, firebaseUid: 'getUserProfile-firebaseUid-1', name: 'user1' })
		const userProfile = await getUserProfile(null, { userUrlId }, { userContext: null })

		expect(userProfile._id).toBeTruthy()
		expect(userProfile.userUrlId).toBe(userUrlId)
	})

	it('should return User Profile without userUrlId argument and with userContext', async () => {
		const userUrlId = 'getUserProfile-test-1'
		const user = await User.create({ userUrlId, firebaseUid: 'getUserProfile-firebaseUid-1', name: 'user1' })
		const userProfile = await getUserProfile(null, {}, { userContext: { _id: user._id } })

		expect(userProfile._id).toBeTruthy()
		expect(userProfile.userUrlId).toBe(userUrlId)
	})
})
