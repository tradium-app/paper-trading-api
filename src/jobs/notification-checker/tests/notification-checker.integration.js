require('dotenv').config()
require('../../../db-service/initialize')
import NotificationChecker from '../index'

jest.setTimeout(200000)

describe('notification checker', () => {
	it('should run notification-checker successfully', async () => {
		await NotificationChecker()
	})
})
