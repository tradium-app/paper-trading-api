module.exports = async function(context) {
	const timestamp = new Date().toISOString()
	const topicDbService = require('../../db-service/topicDbService')
	const newsDbService = require('../../db-service/newsDbService')
	const { scrapeTopic } = require('./topicCrawler')

	try {
		const sources = await newsDbService.getAllSources()
		if (sources && sources.length > 0) {
			for (const source of sources) {
				const baseUrl = source.link
				const { error, topics } = await scrapeTopic(baseUrl)
				if (error) {
					context.log('Error occured while getting topics', error)
					continue
				}
				if (Array.isArray(topics) && topics.length > 0) {
					const savedTopics = await topicDbService.saveTopics(topics)
					if (savedTopics != null) {
						context.log('topics saved successfully!!!')
					}
				}
			}
		}
	} catch (error) {
		console.log('error has occured here', error)
	}
	context.log('JavaScript timer trigger function ran!', timestamp)
}
