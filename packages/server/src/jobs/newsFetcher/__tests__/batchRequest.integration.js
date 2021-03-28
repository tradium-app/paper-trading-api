const batchRequest = require('../batchRequest')

describe('batchRequest', () => {
	it('returns response', async () => {
		await batchRequest(['aapl', 'tsla'])
	})
})
