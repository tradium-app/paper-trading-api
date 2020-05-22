const { post } = require('./http')
const logger = require('../../config/logger')

const sendPushNotification = async (notification) => {
	try {
		const response = await post(undefined, notification)
		if (response.status === 200 && response.data.success === 1) {
			return { status: true, success: response.data.success, failure: response.data.failure }
		} else {
			logger.error(response.data.results)
			return { status: false }
		}
	} catch (error) {
		logger.error(error)
		return { status: false, message: `Notification send failed: ${error.stack}` }
	}
}

module.exports = {
	sendPushNotification,
}
