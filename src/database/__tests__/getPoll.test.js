const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User, Poll } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { getPoll },
} = require('../resolvers')

describe('Resolvers Query getPoll', () => {
	it('should return Poll with userUrlId, pollUrlId and without userContext', async () => {
		const epochTime = Date.now()
		const userUrlId = `userUrlId-${epochTime}`
		const pollUrlId = `pollUrlId-${epochTime}`

		const author = await User.create({ userUrlId, firebaseUid: `fuid-${epochTime}` })
		await Poll.create({ pollUrlId, question: `question-${epochTime}`, author: author._id })

		const poll = await getPoll(null, { userUrlId, pollUrlId }, {})

		expect(poll.pollUrlId).toBe(pollUrlId)
		expect(poll.author.userUrlId).toBe(userUrlId)
	})
})
