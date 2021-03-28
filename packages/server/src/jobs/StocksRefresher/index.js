const logger = require('../../config/logger')
const { News } = require('../../db-service/database/mongooseSchema')
const batchRequest = require('./batchRequest')

module.exports = async function () {
	try {
		// get list of unique stocks from db
		const stocks = ['aapl', 'tsla']
		const response = await batchRequest(stocks)

		console.log('printing Object.entries(response.data)', Object.entries(response.data))

		let news = []
		Object.keys(response.data).forEach((key) => {
			news = news.concat(response.data[key].news)
		})

		news.forEach((n) => {
			n.imageUrl = n.image
			n.relatedStockSymbols = n.related
		})

		console.log('printing news', news)

		news.forEach((n) => {
			News.create(n)
		})

		logger.info('Total stocks refreshed.', stocks.length)
	} catch (error) {
		logger.error('Error while refreshing stocks:', error)
	}
}
