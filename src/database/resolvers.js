const { Stock } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getNewGame: async (_, {}, {}) => {
			return []
		},
	},
}
