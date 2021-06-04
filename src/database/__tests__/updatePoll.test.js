const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { User, Poll } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Mutation: { updatePoll },
} = require('../resolvers')

describe('Mutation updatePoll', () => {
	it('should update Poll', async () => {
		const userUrlId = 'userUrlId-updatePoll-1'
		const pollUrlId = 'pollUrlId-updatePoll-1'

		const author = await User.create({ userUrlId, firebaseUid: 'fuid-1', name: 'user1' })
		const poll = await Poll.create({
			pollUrlId,
			question: 'question-updatePoll-1',
			author: author._id,
			options: [
				{ text: 'option1', order: 1 },
				{ text: 'option2', order: 2, votes: [author._id] },
			],
			tags: ['tag1', 'tag2'],
		})

		const newQuestionValue = 'new-question-updatePoll-1'
		const newOptionValue1 = 'new-option1'
		const newOptionValue2 = 'new-option2'
		const newTags = ['tag2', 'tag3', 'tag4']

		const pollInput = {
			_id: poll._id,
			question: newQuestionValue,
			options: [
				{ _id: poll.options[0]._id, text: newOptionValue1, order: 1 },
				{ _id: poll.options[1]._id, text: newOptionValue2, order: 2 },
			],
			tags: newTags,
		}

		const result = await updatePoll(null, { pollInput }, { userContext: { _id: author._id } })

		expect(result.success).toBe(true)

		const pollUpdated = await Poll.findById(pollInput._id)

		expect(pollUpdated.question).toBe(newQuestionValue)

		const option1 = pollUpdated.options.find((o) => o.order == 1)
		const option2 = pollUpdated.options.find((o) => o.order == 2)
		expect(option1.text).toBe(newOptionValue1)
		expect(option2.text).toBe(newOptionValue2)
		expect(option2.votes[0].toString()).toBe(author._id.toString())
	})
})
