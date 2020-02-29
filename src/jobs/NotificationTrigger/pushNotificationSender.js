const { post } = require('./http')

const sendPushNotification = async notification => {
	try {
		const response = await post(undefined, notification)
		if (response.status === 200) {
			return true
		} else {
			return false
		}
	} catch (error) {
		console.log('_____could not send notification_______', error)
	}
}

module.exports = {
	sendPushNotification,
}
