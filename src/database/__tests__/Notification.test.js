const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User, Notification } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { getNotifications },
} = require('../resolvers')

describe('getNotifications Query', () => {
	it('should return Notifications with userContext', async () => {
		const epochTime = Date.now()
		const userUrlId = `userUrlId-${epochTime}`
		const message = 'dummy notification'

		const user = await User.create({ userUrlId, firebaseUid: `fuid-${epochTime}`, name: 'user1' })
		await Notification.create({ user: user._id, message })

		const notifications = await getNotifications(null, {}, { userContext: { _id: user._id } })

		expect(notifications[0].message).toBe(message)
		expect(notifications[0].user._id.toString()).toBe(user._id.toString())
	})
})
