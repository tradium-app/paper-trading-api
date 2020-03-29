const { sendPushNotification } = require('../pushNotificationSender')
const { newsDbService } = require('../../../db-service/')
require('dotenv').config()

describe('PushNotificationSender integration', () => {
	it('single notification should go successfullly', async () => {
		const latestArticle = await newsDbService.getLatestNewsArticle()

		const oneNotification = {
			notification: {
				title: latestArticle[0].title,
				body: latestArticle[0].shortDescription
			},
			to: process.env.TEST_USER_FCM_TOKEN
		}
		let notificationSentStatus = await sendPushNotification(oneNotification)

		expect(notificationSentStatus.status).toBeTruthy()
	})
})
