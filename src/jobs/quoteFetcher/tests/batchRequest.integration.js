const batchRequest = require('../batchRequest')

describe('batchRequest', () => {
	it('returns response', async () => {
		const response = await batchRequest(['aapl', 'tsla'])
		expect(response.data.AAPL.quote.close).toBeGreaterThan(0)
	})
})
