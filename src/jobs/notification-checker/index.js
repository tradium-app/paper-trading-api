const { Poll, Notification } = require('../../db-service/database/mongooseSchema')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		const polls = await Poll.find().populate('author').populate('options.votes').lean().sort({ modifiedDate: -1 }).limit(100)

		var oneWeekAgo = new Date()
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
		const notifications = await Notification.find({ modifiedDate: { $gte: oneWeekAgo } })
			.populate('user')
			.limit(1000)

		const createPromises = []

		polls.forEach((poll) => {
			poll.options.forEach((option) => {
				const pollNotifications = notifications.find((notif) => {
					return option.votes.some((vote) => {
						vote._id == notif.user._id && notif.poll._id == poll._id
					})
				})

				if (!pollNotifications && option.votes.length > 0) {
					let message = ``
					const messageSuffix = 'answered your poll. Please take a look.'
					let userNames = []

					for (let index = 0; index <= 2 && index < option.votes.length; index++) {
						userNames[index] = option.votes[index].name.split(' ')[0]
					}

					if (option.votes.length > 2) {
						message = `${userNames[0]}, ${userNames[1]} and ${option.votes.length - 2} more people have ${messageSuffix}`
					} else if (option.votes.length == 2) {
						message = `${userNames[0]} and ${userNames[1]} have ${messageSuffix}`
					} else {
						message = `${userNames[0]} has ${messageSuffix}`
					}

					const createPromise = Notification.create({ user: poll.author._id, poll: poll._id, message })
					createPromises.push(createPromise)
				}
			})
		})

		await Promise.all(createPromises)
	} catch (error) {
		logger.info('Notification checker error ', error)
	}
	logger.info('Notification job completed')
}
