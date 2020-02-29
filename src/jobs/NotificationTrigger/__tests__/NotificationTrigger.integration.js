const NotificationTrigger = require('../index')

jest.setTimeout(200000)

describe('NotificationTrigger integration', () => {
	it('Integration test', async () => {
		await NotificationTrigger(console, {})
	})
})
