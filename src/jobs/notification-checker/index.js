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
			poll.author &&
				poll.options.forEach((option) => {
					const votes = option.votes.filter((vote) => vote._id.toString() != poll.author._id.toString())

					const pollNotifications = notifications.find((notif) => {
						return votes.some((vote) => {
							vote._id == notif.user._id && notif.poll._id == poll._id
						})
					})

					if (!pollNotifications && votes.length > 0) {
						let message = ``
						const messageSuffix = 'answered your poll. Please take a look.'
						let userNames = []

						for (let index = 0; index <= 2 && index < votes.length; index++) {
							userNames[index] = votes[index].name.split(' ')[0]
						}

						if (votes.length > 2) {
							message = `${userNames[0]}, ${userNames[1]} and ${votes.length - 2} more people have ${messageSuffix}`
						} else if (votes.length == 2) {
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
