const { NotificationDbService } = require('../../db-service')
const { getStartEndTime } = require('./notificationTime')

const notificationExists = async (user, article) => {
	try {
    const todaysTimeFrame = getStartEndTime(user.timeZone)
		const todaysNotifications = await NotificationDbService.getNotifications({
			createdAt: { $gte: todaysTimeFrame.startTime, $lt: todaysTimeFrame.endTime },
		})
		const hasSent = todaysNotifications.find(
      notification => String(notification.user) === String(user._id) 
      && String(notification.article) === String(article._id))

		if (hasSent) {
			return true
		} else {
			return false
		}
	} catch (error) {
		console.log('could not get todays notification', error)
	}
}

const createUserWithNotification = (article, user) => {
	return {
		notification: {
			title: article.title,
			body: article.shortDescription,
		},
		to: user.fcmToken,
	}
}

module.exports = {
	notificationExists,
	createUserWithNotification,
}
