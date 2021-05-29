const TestDbServer = require('../../../db-service/tests/test-db-server.js')
const { Poll, User, Notification } = require('../../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const notificationCheckerJob = require('../index')

describe('notification checker', () => {
	it('should create a notification for voter', async () => {
		const epochTime = Date.now()

		const author = await User.create({ userUrlId: 'userUrlId-1', firebaseUid: 'firebaseUid-1', name: 'user-1' })
		const voter = await User.create({ userUrlId: 'userUrlId-2', firebaseUid: 'firebaseUid-2', name: 'voter1 lastname' })

		const poll = await Poll.create({
			pollUrlId: `pollUrlId-${epochTime}`,
			question: `question-${epochTime}`,
			author: author._id,
			options: [
				{ text: 'option1', order: 1, votes: [voter._id] },
				{ text: 'option2', order: 2 },
			],
		})

		await Notification.create({ user: poll.author._id, poll: poll._id, message: 'dummy notification' })

		await notificationCheckerJob()

		const notification = await Notification.findOne({ poll: poll._id, user: author._id }, {}, { sort: { modifiedDate: -1 } })

		expect(notification.message).toMatch(/voter1/i)
	})
})
