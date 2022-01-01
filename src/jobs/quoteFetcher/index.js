const logger = require('../../config/logger')
const { Stock } = require('../../db-service/database/mongooseSchema')
const batchRequest = require('./batchRequest')

module.exports = async function () {
	try {
		const symbols = (await Stock.find({ shouldRefresh: true }).lean()).map((s) => s.symbol)
		if (symbols.length <= 0) return

		const response = await batchRequest(symbols)

		for (const [key, value] of Object.entries(response.data)) {
			try {
				await Stock.updateOne(
					{ symbol: key },
					{
						$set: {
							...value.quote,
							company: value.quote.companyName,
							price: value.quote.latestPrice,
							changePercent: value.quote.changePercent * 100,
							marketCap: value.quote.marketCap / 1000000,
							peRatio: value.quote.peRatio,
							week52High: value.quote.week52High,
							week52Low: value.quote.week52Low,
							ytdChangePercent: value.quote.ytdChange * 100,
							modifiedDate: value.quote.latestUpdate,
						},
						$push: {
							price_history: {
								close: value.quote.latestPrice,
								open: value.quote.open,
								high: value.quote.high,
								low: value.quote.low,
								timeStamp: value.quote.latestUpdate,
							},
						},
					},
					{ upsert: true },
				)
			} catch (error) {
				console.log('printing error', error)
				logger.error('Error while refreshing stock:', { key, error })
			}
		}

		logger.info('Total stocks refreshed.', symbols.length)
	} catch (error) {
		logger.error('Error while refreshing stocks:', error)
	}
}
