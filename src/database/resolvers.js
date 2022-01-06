const { Stock } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min
}

module.exports = {
	Query: {
		getNewGame: async (_, {}, {}) => {
			try {
				const totalStocks = await Stock.count()
				const randomNum1 = Math.floor(getRandomArbitrary(0, totalStocks))
				const stock = await Stock.findOne().skip(randomNum1)
				const randomNum2 = Math.floor(getRandomArbitrary(stock.price_history.length - 100, 30))

				const newGame = {
					symbol: stock.symbol,
					company: stock.company,
					timeStamp: stock.price_history[randomNum2].timeStamp,
					price_history: stock.price_history.slice(randomNum2 - 30, randomNum2),
					future_price_history: stock.price_history.slice(randomNum2, randomNum2 + 300),
				}

				return newGame
			} catch (error) {
				logger.error('Error while getting new game:', error)
			}
		},
	},
}
