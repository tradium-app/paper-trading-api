const logger = require('../../config/logger')
const { News, Stock } = require('../../db-service/database/mongooseSchema')
const batchRequest = require('./batchRequest')

module.exports = async function () {
	try {
		const activeStocks = await Stock.find({ shouldRefresh: true })
		const response = await batchRequest(activeStocks.map((s) => s.symbol))

		let news = []
		Object.keys(response.data).forEach((key) => {
			news = news.concat(response.data[key].news)
		})

		news = news.map((n) => {
			n.publishedDate = n.datetime
			n.imageUrl = n.image
			n.relatedStockSymbols = n.related
			n.relatedStocks = activeStocks.filter((a) => n.related.toUpperCase().split(',').includes(a.symbol.toUpperCase()))
			return n
		})

		news = news.filter((n) => n.lang == 'en')

		await News.insertMany(news, { ordered: false })

		logger.info('Total news fetched.', news.length)
	} catch (error) {
		logger.error('Error while refreshing stocks:', error)
	}
}
