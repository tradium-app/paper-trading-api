require('../../db-service/initialize')

const {
	Query: { getNewGame },
} = require('../resolvers')

describe('Resolvers Query getNewGame', () => {
	it('should return a random Game to predict', async () => {
		const newGame = await getNewGame(null, {}, {})

		console.log('printing newGame', newGame.timeStamp)
		expect(newGame.willPriceIncrease || newGame.willPriceDecrease).toBe(true)
	})
})
