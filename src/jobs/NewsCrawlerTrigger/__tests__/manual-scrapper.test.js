import manualScrapper from '../manual-scrapper'
import { selector } from '../config/selector'

describe('manual-scrapper', () => {
	it('manualScrapper should scrape ekantipur', async () => {
		const link = 'https://ekantipur.com/bibidha/2019/09/10/156811002238917391.html'
		const logoLink = 'test logoLink'

		const { error, data } = await manualScrapper(link, logoLink, selector.kantipur)

		expect(data.content).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape setopati', async () => {
		const link = 'https://www.setopati.com/social/189567'
		const logoLink = 'test logoLink'

		const { error, data } = await manualScrapper(link, logoLink, selector.setopati)

		expect(data.content).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('content should not start with whitespace', async () => {
		const link = 'https://www.setopati.com/social/189567'
		const logoLink = 'test logoLink'

		const { error, data } = await manualScrapper(link, logoLink, selector.setopati)

		expect(data.content[0]).not.toBe(' ')
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape ratopati', async () => {
		const link = 'https://ratopati.com/story/99093/2019/9/3/banana-business'
		const logoLink = 'test logoLink'

		const { error, data } = await manualScrapper(link, logoLink, selector.ratopati)

		expect(data.content).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape dainik khavar', async () => {
		const link = 'https://www.dainiknepal.com/2019/09/411725.html'
		const logoLink = 'test logoLink'

		const { error, data } = await manualScrapper(link, logoLink, selector.ratopati)

		expect(data.content).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('manualScrapper short description not more than 300 ', async () => {
		const link = 'https://ratopati.com/story/99093/2019/9/3/banana-business'
		const logoLink = 'test logoLink'

		const { error, data } = await manualScrapper(link, logoLink, selector.ratopati)

		expect(data.shortDescription.length).not.toBeGreaterThan(300)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape online khabar', async () => {
		const link = 'https://onlinekhabar.com/2020/01/827626'
		const logoLink = 'test logoLink'
		const { error, data } = await manualScrapper(link, logoLink, selector.onlinekhabar)
		expect(data.content).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape bbc nepali', async () => {
		const link = 'https://www.bbc.com/nepali/news-51520297'
		const logoLink = 'test logoLink'

		const { error, data } = await manualScrapper(link, logoLink, selector.bbcnepali)
		
		expect(data.content).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape ekantipur topic', async() => {
		const link = 'https://ekantipur.com/news/2020/03/19/15846324235738018.html'
		const logoLink = 'test logoLink'
		const { error, data } = await manualScrapper(link, logoLink, selector.kantipur)
		
		expect(data.topic.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape onlinekhabar topic', async() => {
		const link = 'https://onlinekhabar.com/2020/03/845491'
		const logoLink = 'test logoLink'
		const { error, data } = await manualScrapper(link, logoLink, selector.onlinekhabar)
		
		expect(data.topic.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape setopati topic', async() => {
		const link = 'https://setopati.com/social/201898'
		const logoLink = 'test logoLink'
		const { error, data } = await manualScrapper(link, logoLink, selector.setopati)
		
		expect(data.topic.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should scrape ratopati topic', async() => {
		const link = 'https://ratopati.com/story/122520/2020/3/19/arrest'
		const logoLink = 'test logoLink'
		const { error, data } = await manualScrapper(link, logoLink, selector.ratopati)
		
		expect(data.topic.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})
	it('manualScrapper should dainiknepal topic', async() => {
		const link = 'https://dainiknepal.com/2020/03/441648.html'
		const logoLink = 'test logoLink'
		const { error, data } = await manualScrapper(link, logoLink, selector.dainik)
		
		console.log(data.topic)
		expect(data.topic.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})
})
