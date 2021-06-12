const TestDbServer = require('../../../db-service/tests/test-db-server.js')
const { Poll, User, Notification } = require('../../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const notificationCheckerJob = require('../index')

describe('notification checker', () => {
	it('should create a notification for author about voter only; should create only one notification for a poll in 3 days for a month about new voters only', async () => {
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
				{ text: 'option1', order: 1, votes: [{ voter: voter1._id }] },
				{
					text: 'option2',
					order: 2,
					votes: [{ voter: author._id }, { voter: voter2._id, votingTime: epochTime }, { voter: voter3._id, votingTime: '2020-01-01' }],
				},
			],
			status: 'Published',
		})

		await notificationCheckerJob()
		await notificationCheckerJob()

		let threeDaysAgo = new Date()
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 2)

		const notifications = await Notification.find({ poll: poll._id, user: author._id, createdDate: { $gte: threeDaysAgo } })

		expect(notifications.length).toBe(1)
		expect(notifications[0].message.includes('voter3')).toBe(false)
		expect(notifications[0].message.includes('author1')).toBe(false)
		expect(notifications[0].message.includes('voter2')).toBe(true)
	})
})
