import { scrapeNewsLink } from '../linkCrawler'

describe('link-crawler integration test', () => {
	it('link-crawler should crawl setopati link', async () => {
		const baseUrl = 'https://www.setopati.com'
		const url = 'https://www.setopati.com/sports'

		const { error, links } = await scrapeNewsLink(baseUrl, url)

		expect(links.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})

	it('link-crawler should crawl ekantipur link', async () => {
		const baseUrl = 'https://ekantipur.com'
		const url = 'https://ekantipur.com/news'

		const { error, links } = await scrapeNewsLink(baseUrl, url)

		expect(links.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})

	it('link-crawler should crawl dainikhabar link', async () => {
		const baseUrl = 'https://www.dainiknepal.com'
		const url = 'https://www.dainiknepal.com/section/latest-news'

		const { error, links } = await scrapeNewsLink(baseUrl, url)

		expect(links.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})

	it('link-crawler should crawl ratopati link', async () => {
		const baseUrl = 'https://ratopati.com'
		const url = 'https://ratopati.com/lifestyle/'

		const { error, links } = await scrapeNewsLink(baseUrl, url)

		expect(links.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})

	it('link-crawler should crawl onlinekhabar link', async () => {
		const baseUrl = 'https://www.onlinekhabar.com'
		const url = 'https://www.onlinekhabar.com/business'

		const { error, links } = await scrapeNewsLink(baseUrl, url)

		expect(links.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})

	it('link-crawler should crawl bbc link', async () => {
		const baseUrl = 'https://www.bbc.com/nepali'
		const url = 'https://www.bbc.com/nepali'

		const { error, links } = await scrapeNewsLink(baseUrl, url)

		expect(links.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})
})
