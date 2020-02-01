module.exports = async function(context) {
	const moment = require('moment-timezone')
	const timeStamp = new Date().toISOString()

	const { post } = require('./http')
	const { verifyNoticiableTime } = require('./notificationTime')
	const { userDbService, newsDbService, NotificationDbService } = require('../../db-service')

	try {
		const users = await userDbService.getUsers()
		if (users) {
			const userWithCurrentTime = users.map(user => {
				const currentTime = moment()
					.tz(user.timeZone)
					.format('HH:mm')

				return {
					...user,
					currentTime,
				}
			})

			const article = await newsDbService.getLatestNewsArticle()

			if (article) {
				const notifications = []
				for (const user of userWithCurrentTime) {
					const eligibleTime = verifyNoticiableTime(user.currentTime)
					if (eligibleTime) {
						const data = {
							notification: {
								title: article[0].title,
								body: article[0].shortDescription,
							},
							to: user.fcmToken,
						}
						const response = await post(undefined, data)
						if (response.status === 200) {
							const payload = {
								article: article[0]._id,
								user: user._id,
							}
							notifications.push(payload)
						}
					} else {
						console.log(userWithCurrentTime.currentTime)
					}
				}
				if (notifications.length > 0) {
					const notificationResponse = await NotificationDbService.saveNotifications(notifications)
					if (notificationResponse) {
						context.log('_____________notifications are saved successfully__________')
					}
				}
			}
		}
	} catch (error) {
		context.log('_____________error__________', error)
	}

	context.log('JavaScript timer trigger function ran!', timeStamp)
}
