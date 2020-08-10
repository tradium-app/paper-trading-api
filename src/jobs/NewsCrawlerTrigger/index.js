var Bugsnag = require('@bugsnag/js')
var BugsnagPluginExpress = require('@bugsnag/plugin-express')

Bugsnag.start({
  apiKey: 'bf6ecbb87c478df6c456d6d297a82f4f',
  plugins: [BugsnagPluginExpress]
})

module.exports = async function (context) {
	var timeStamp = new Date().toISOString()
	const newsDbService = require('../../db-service/newsDbService')

	const { scrapeNewsLink } = require('./linkCrawler')
	const { getNewsContent } = require('./content-crawler')
	const { removeForwardSlashAndWhiteSpaces } = require('../../utils/arrayUtil')

	const ipAddress = require('ip').address()

	const getCategoryName = (category) => {
		if (category === 'news' || category === 'politics') {
			return 'news'
		} else {
			return category
		}
	}

	try {
		const sources = await newsDbService.getAllSources()
		if (sources) {
			for (const source of sources) {
				const sourceId = source._id
				const baseUrl = source.link
				const logoLink = source.logoLink
				const categories = source.category

				if (categories) {
					const crawlTime = new Date()

					for (const category of categories) {
						const categoryName = category.name
						const url = `${baseUrl}${category.path}`

						const { error, links } = await scrapeNewsLink(baseUrl, url)
						if (error) {
							context.log('Error occured getting news lnks ', error)
							continue
						}

						if (Array.isArray(links) && links.length > 0) {
							for (const link of links) {
								const content = await getNewsContent(`${link}`, logoLink, baseUrl, context)

								if (content && content.title && content.shortDescription && sourceId) {
									content.source = sourceId
									content.createdDate = crawlTime
									content.modifiedDate = crawlTime
									content.publishedDate = crawlTime
									content.isHeadline = true // TODO: check if h1 or h2
									content.hostIp = ipAddress
									content.category = getCategoryName(categoryName)
									content.topic = removeForwardSlashAndWhiteSpaces(content.topic)
									const savedArticle = await newsDbService.saveArticle(content)
									if (savedArticle) {
										context.log('article saved successfully!!!!')
									}
								}else{
									Bugsnag.notify("data null "+link)
								}
							}
						}
					}
				}
			}
		}
	} catch (error) {
		context.log('error occured here', error)
	}

	context.log('JavaScript timer trigger function ran!', timeStamp)
}
