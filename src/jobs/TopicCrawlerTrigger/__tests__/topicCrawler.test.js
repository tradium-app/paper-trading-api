import { scrapeTopic } from '../topicCrawler'

jest.setTimeout(20000)

describe('topic-crawler integration test', () => {
	it('topic-crawler should crawl setopati topic', async () => {
		const baseUrl = 'https://setopati.com'
		const { error, topics } = await scrapeTopic(baseUrl)
		console.log('topics______', topics)
		expect(topics).not.toBe(null)
		expect(error).toBeFalsy()
	})

	it('topic-crawler should crawl onlinekhabar topic', async () => {
		const baseUrl = 'https://onlinekhabar.com'
		const { error, topics } = await scrapeTopic(baseUrl)
		console.log('topics______', topics)
		expect(topics).not.toBe(null)
		expect(error).toBeFalsy()
	})

	it('topic-crawler should crawl ratopati topic', async () => {
		const baseUrl = 'https://ratopati.com'
		const { error, topics } = await scrapeTopic(baseUrl)
		console.log('topics______', topics)
		expect(topics).not.toBe(null)
		expect(error).toBeFalsy()
	})

	it('topic-crawler should crawl dainikkhabar topic', async () => {
		const baseUrl = 'https://dainiknepal.com'
		const { error, topics } = await scrapeTopic(baseUrl)
		console.log('topics______', topics)
		expect(topics).not.toBe(null)
		expect(error).toBeFalsy()
	})

	it('topic-crawler should crawl bbcNepali topic', async () => {
		const baseUrl = 'https://bbc.com/nepali'
		const { error, topics } = await scrapeTopic(baseUrl)
		console.log('topics______', topics)
		expect(topics).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('topic-crawler should crawl ekantipur topic', async () => {
		const baseUrl = 'https://ekantipur.com'
		const { error, topics } = await scrapeTopic(baseUrl)
		console.log('topics______', topics)
		expect(topics).not.toBe(null)
		expect(error).toBeFalsy()
	})
})
