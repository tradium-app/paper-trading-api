const TestDbServer = require('../../../db-service/tests/test-db-server.js')
const { Poll, User, Tag } = require('../../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const ComputeTrendingTagsJob = require('../index')

describe('compute-trending-tags', () => {
	it('should compute tags count from multiple polls correctly', async () => {
		const author = await User.create({ userUrlId: 'userUrlId-1', firebaseUid: 'firebaseUid-1', name: 'author1' })

		await Poll.create({
			tags: ['tag1', 'tag1', 'tag1', 'tag2', 'tag3'],
			pollUrlId: `pollUrlId-1`,
			question: `question-1`,
			author: author._id,
			options: [
				{ text: 'option1', order: 1 },
				{ text: 'option2', order: 2, votes: [author._id] },
			],
		})
		await Poll.create({
			tags: ['tag1', 'tag2', 'tag2', 'tag3', ''],
			pollUrlId: `pollUrlId-2`,
			question: `question-2`,
			author: author._id,
			options: [
				{ text: 'option1', order: 1 },
				{ text: 'option2', order: 2, votes: [author._id] },
			],
		})

		await ComputeTrendingTagsJob()

		const tagGroups = await Tag.find().lean()
		expect(tagGroups.find((tg) => tg.tagId == 'tag1').currentMonthCount).toBe(4)
		expect(tagGroups.find((tg) => tg.tagId == 'tag2').currentMonthCount).toBe(3)
		expect(tagGroups.some((tg) => tg.tagId == '')).toBe(false)
	})
})
