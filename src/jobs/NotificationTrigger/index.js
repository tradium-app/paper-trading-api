module.exports = async function(context) {
	const moment = require('moment-timezone')
	const timeStamp = new Date().toISOString()

	const { post } = require('./http')
	const { verifyNoticiableTime, getStartEndTime } = require('./notificationTime')
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
			if (userWithCurrentTime) {
				const article = await newsDbService.getLatestNewsArticle()
				console.log('latest__article', article)
				const todaysTimeFrame = getStartEndTime()

				const todaysNotifications = await NotificationDbService.getNotifications({
					createdAt: { $gte: todaysTimeFrame.startTime, $lt: todaysTimeFrame.endTime },
				})

				if (article) {
					const notifications = []
					for (const user of userWithCurrentTime) {
						const isSent = todaysNotifications.find(
							notification => String(notification.user) === String(user._id) && String(notification.article) === String(article[0]._id),
						)
						if (isSent) {
							continue
						}
						const eligibleTime = verifyNoticiableTime(user.currentTime)
						if (eligibleTime) {
							console.log('eligible_to_send_notification', eligibleTime)
							const data = {
								notification: {
									title: article[0].title,
									body: article[0].shortDescription,
								},
								to: user.fcmToken,
							}
							try {
								const response = await post(undefined, data)
								if (response.status === 200) {
									const payload = {
										article: article[0]._id,
										user: user._id,
									}
									console.log('notification_payload', payload)
									notifications.push(payload)
								}
							} catch (err) {
								console.log(err)
							}
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
		}
	} catch (error) {
		context.log('_____________error__________', error)
	}

	context.log('JavaScript timer trigger function ran!', timeStamp)
}
