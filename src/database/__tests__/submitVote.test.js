const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User, Poll } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Mutation: { submitVote },
} = require('../resolvers')

describe('Mutation submitVote', () => {
	it('should submit vote', async () => {
		const author = await User.create({ userUrlId: 'userUrlId1', firebaseUid: 'fuid-searchPolls-1', name: 'user-searchPolls-1' })
		const voter1 = await User.create({ userUrlId: 'voter1', firebaseUid: 'fuid-voter1-1', name: 'user-voter1-1' })

		const poll = await Poll.create({
			pollUrlId: 'pollUrlId-1',
			question: 'is this question on mutation?',
			author: author._id,
			options: [
				{ text: 'option a', order: 1 },
				{ text: 'option b', order: 2, votes: [{ voter: author._id }, { voter: voter1._id }] },
			],
			tags: ['searchPolls1', 'searchPolls2', 'searchPolls3'],
			status: 'Published',
		})

		const pollVote = { pollId: poll._id, optionId: poll.options[0]._id }
		const voteResult = await submitVote({}, { pollVote }, { userContext: { _id: voter1._id } })

		expect(voter1._id.toString()).toBe(voteResult.poll.options[0].votes[0].voter.toString())
	})
})
