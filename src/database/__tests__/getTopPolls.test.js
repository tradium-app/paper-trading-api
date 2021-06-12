const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User, Poll } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { getTopPolls },
} = require('../resolvers')

describe('Resolvers Query getTopPolls', () => {
	it('should return Poll with userUrlId, pollUrlId and without userContext', async () => {
		const epochTime = Date.now()
		const userUrlId = `userUrlId-${epochTime}`
		const pollUrlId = `pollUrlId-${epochTime}`

		const author = await User.create({ userUrlId, firebaseUid: `fuid-${epochTime}`, name: 'user1' })
		await Poll.create({
			pollUrlId,
			question: `question-${epochTime}`,
			author: author._id,
			options: [
				{ order: 1, text: 'option 1' },
				{ order: 2, text: 'option 2', votes: [{ voter: author.id }] },
			],
			status: 'Published',
		})

		const polls = await getTopPolls(null, { userUrlId, pollUrlId }, {})

		expect(polls[0].pollUrlId).toBe(pollUrlId)
		expect(polls[0].author.userUrlId).toBe(userUrlId)
		expect(polls[0].options[1].totalVotes).toBe(1)
	})
})
