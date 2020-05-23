require('dotenv').config()
const TestDbServer = require('./test-db-server')
const TweetDbService = require('../TweetDbService.js')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

describe('TweetDbService Unit ', () => {
	it('saveTwitterHandles should save TwitterHandles', async () => {
		const handles = { name: 'dummy celebrity', handle: 'duummy' }
		const twitterHandles = await TweetDbService.saveTwitterHandles([handles])

		TweetDbService.deleteTwitterHandles({ _id: twitterHandles[0]._id })
	})
})
