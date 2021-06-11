const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User, Poll } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { searchPolls },
} = require('../resolvers')

describe('Resolvers Query searchPolls', () => {
	it('should return Poll based on searchText only', async () => {
		const author = await User.create({ userUrlId: 'userUrlId1', firebaseUid: `fuid-searchPolls-1`, name: 'user-searchPolls-1' })
		const poll = await Poll.create({
			pollUrlId: 'pollUrlId-1',
			question: 'is this question on javascript?',
			author: author._id,
			options: [
				{ text: 'option1', order: 1 },
				{ text: 'option2', order: 2, votes: [author._id] },
			],
			tags: ['searchPolls1', 'searchPolls2', 'searchPolls3'],
			status: 'Published',
		})
		await Poll.ensureIndexes()

		const resultPolls = await searchPolls(null, { searchText: 'question on' }, {})

		expect(resultPolls[0]._id.toString()).toBe(poll._id.toString())
	})
})
