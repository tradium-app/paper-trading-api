const { post } = require('./http')

const sendPushNotification = async (notification) => {
	try {
		const response = await post(undefined, notification)
		if (response.status === 200) {
			return { status: true }
		} else {
			return { status: false }
		}
	} catch (error) {
		return { status: false, message: `Notification send failed: ${error.stack}` }
	}
}

module.exports = {
	sendPushNotification
}
