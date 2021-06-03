const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { Tag } = require('../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { getTopTags },
} = require('../resolvers')

describe('Resolvers Query getTopTags', () => {
	it('should return Top Tags without userContext', async () => {
		await Tag.insertMany([
			{ tagId: 'JavaScript', currentMonthCount: 2 },
			{ tagId: 'Java', currentMonthCount: 5 },
			{ tagId: 'Python', currentMonthCount: 3 },
		])

		const tagGroups = await getTopTags({}, { searchText: 'ja' }, {})

		expect(tagGroups.length).toBe(2)
		expect(tagGroups.find((tg) => tg.tagId == 'Python')).toBe(undefined)
		expect(tagGroups.find((tg) => tg.tagId == 'Java').currentMonthCount).toBe(5)
	})
})
