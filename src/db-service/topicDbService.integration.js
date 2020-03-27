require('dotenv').config()
const topicDbService = require('./topicDbService')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

jest.setTimeout(20000)

describe('TopicDbService', () => {
	beforeAll(() => {
		mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
	})
	it('saveTopic should save an topic successfully', async () => {
		const topic = {
			topicTitle: 'dummy topic title' + Math.random(),
			topicPath: 'dummy topic path' + Math.random()
		}
		const savedTopic = await topicDbService.saveTopic(topic)

		expect(savedTopic).not.toBeUndefined()
		expect(savedTopic).not.ToBeNull()
		expect(savedTopic._id).not.toBeNull()
	})

	it('saveTopics should save topics in bulk', async () => {
		const topics = [
			{
				topicTitle: 'dummy topic title 1 ' + Math.random(),
				topicPath: 'dummy topic path 1 ' + Math.random()
			},
			{
				topicTitle: 'dummy topic title 2 ' + Math.random(),
				topicPath: 'dummy topic path 2 ' + Math.random()
			},
			{
				topicTitle: 'dummy topic title 3 ' + Math.random(),
				topicPath: 'dummy topic path 3 ' + Math.random()
			},
			{
				topicTitle: 'dummy topic title 4 ' + Math.random(),
				topicPath: 'dummy topic path 4 ' + Math.random()
			}
		]

		const savedTopics = await topicDbService.saveTopics(topics)
		expect(savedTopics).not.toBeUndefined()
		expect(savedTopics).not.toBeNull()
	})

	it('getTopic should return topics', async () => {
		const topics = await topicDbService.getTopic()
		console.log(topics)
		expect(topics).not.toBeUndefined()
	})
})
