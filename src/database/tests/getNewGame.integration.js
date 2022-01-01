require('../../db-service/initialize')

const {
	Query: { getNewGame },
} = require('../resolvers')

describe('Resolvers Query getNewGame', () => {
	it('should return a random Game to predict', async () => {
		const newGame = await getNewGame(null, {}, {})

		expect(newGame.future_price_history.length > 50).toBe(true)
	})
})
