const TestDbServer = require('../../../db-service/tests/test-db-server.js')
const { Poll, User, Notification } = require('../../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const notificationCheckerJob = require('../index')

describe('notification checker', () => {
	it('should create a notification for author about voter only; should create only one notification in 3 days for a month', async () => {
		const epochTime = Date.now()

		const author = await User.create({ userUrlId: 'userUrlId-1', firebaseUid: 'firebaseUid-1', name: 'author1' })
		const voter1 = await User.create({ userUrlId: 'userUrlId-2', firebaseUid: 'firebaseUid-2', name: 'voter1 lastname' })
		const voter2 = await User.create({ userUrlId: 'userUrlId-3', firebaseUid: 'firebaseUid-3', name: 'voter2 lastname' })
		const voter3 = await User.create({ userUrlId: 'userUrlId-4', firebaseUid: 'firebaseUid-4', name: 'voter3 lastname' })

		const poll = await Poll.create({
			pollUrlId: `pollUrlId-${epochTime}`,
			question: `question-${epochTime}`,
			author: author._id,
			options: [
				{ text: 'option1', order: 1, votes: [voter1._id] },
				{ text: 'option2', order: 2, votes: [author._id, voter2._id, voter3._id] },
			],
		})

		await notificationCheckerJob()
		await notificationCheckerJob()

		const notifications = await Notification.find({ poll: poll._id, user: author._id }, {}, { sort: { modifiedDate: -1 } })

		expect(notifications.filter((notif) => /voter3/g.test(notif.message)).length).toBe(1)
		expect(notifications.some((notif) => /author1/g.test(notif.message))).toBe(false)
	})
})
