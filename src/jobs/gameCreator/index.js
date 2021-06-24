const logger = require('../../config/logger')
const { Stock, Game } = require('../../db-service/database/mongooseSchema')

module.exports = async function () {
	try {
		const stocks = await Stock.find({ shouldRefresh: true }).lean()
		if (stocks.length <= 0) return
		let gameCreatePromises = []

		stocks.forEach((stock) => {
			const price_history = [...stock.price_history].sort((a, b) => (a.timeStamp > b.timeStamp ? 1 : -1))

			for (let index = 0; index < price_history.length - 10; index++) {
				const current_price = price_history[index]
				const future_price_history = price_history.slice(index, index + 10)

				const willPriceIncrease = future_price_history.some((future_price) => future_price.close > current_price.close * 1.05)
				const willPriceDecrease = future_price_history.some((future_price) => future_price.close < current_price.close * 0.95)

				if (willPriceIncrease || willPriceDecrease) {
					const gameCreatePromise = Game.findOneAndUpdate(
						{ symbol: stock.symbol, timeStamp: current_price.timeStamp },
						{
							symbol: stock.symbol,
							timeStamp: current_price.timeStamp,
							company: stock.company,
							price_history: price_history.slice(index - 100 > 0 ? index - 100 : 0, index),
							future_price_history,
							willPriceIncrease,
							willPriceDecrease,
						},
						{ upsert: true, setDefaultsOnInsert: true },
					)

					gameCreatePromises.push(gameCreatePromise)
				}
			}
		})

		await Promise.all(gameCreatePromises)

		logger.info('Total games created.', gameCreatePromises.length)
	} catch (error) {
		logger.error('Error while creating games:', error)
	}
}
