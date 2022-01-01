const { Stock } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min
}

module.exports = {
	Query: {
		getNewGame: async (_, {}, {}) => {
			try {
				const stock = await Stock.findOne({ symbol: 'NFLX' })
				const randomIndex = Math.floor(getRandomArbitrary(stock.price_history.length - 100, 30))

				const newGame = {
					symbol: stock.symbol,
					company: stock.company,
					timeStamp: stock.price_history[randomIndex].timeStamp,
					price_history: stock.price_history.slice(randomIndex - 30, randomIndex),
					future_price_history: stock.price_history.slice(randomIndex, randomIndex + 100),
				}

				return newGame
			} catch (error) {
				logger.error('Error while getting new game:', error)
			}
		},
	},
}
