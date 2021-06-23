const { Game } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getNewGame: async (_, {}, {}) => {
			try {
				const totalGames = await Game.count()
				const randomGameIndex = Math.floor(Math.random() * totalGames)
				const newGame = await Game.findOne().skip(randomGameIndex)
				return newGame
			} catch (error) {
				logger.error('Error while getting new game:', error)
			}
		},
	},
}
