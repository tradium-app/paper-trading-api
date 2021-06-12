const { Poll, Notification } = require('../../db-service/database/mongooseSchema')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		const { threeDaysAgo, aMonthAgo } = getDateVariables()

		const polls = await Poll.find({ createdDate: { $gte: aMonthAgo }, status: 'Published' })
			.populate('author')
			.populate('options.votes.voter')
			.lean()
			.sort({ modifiedDate: -1 })
			.limit(100)

		let allNotificationsIn3Days = await Notification.find({ createdDate: { $gte: threeDaysAgo } }, { poll: 1 }).lean()
		allNotificationsIn3Days = allNotificationsIn3Days.map((n) => n.poll.toString())

		const createPromises = []

		polls.forEach((poll) => {
			let totalVotes = poll.options?.reduce((totalVoters, option) => {
				return { votes: totalVoters.votes.concat(option.votes.filter((v) => v.votingTime > threeDaysAgo)) }
			}).votes
			totalVotes = totalVotes.filter((vote) => vote.voter?._id.toString() != poll.author?._id.toString())

			if (poll.author && totalVotes.length > 0) {
				let message = ``
				const messageSuffix = `answered your poll. "${poll.question.substring(0, 100)}.." Please take a look.`
				let userNames = []

				for (let index = totalVotes.length - 1; index >= 0 && index > totalVotes.length - 3; index--) {
					userNames.push(totalVotes[index].voter.name.split(' ')[0])
				}

				if (totalVotes.length > 2) {
					message = `${userNames[0]}, ${userNames[1]} and ${totalVotes.length - 2} more people have ${messageSuffix}`
				} else if (totalVotes.length == 2) {
					message = `${userNames[0]} and ${userNames[1]} have ${messageSuffix}`
				} else {
					message = `${userNames[0]} has ${messageSuffix}`
				}

				if (allNotificationsIn3Days.includes(poll._id.toString()) == false) {
					const createPromise = Notification.create({
						user: poll.author._id,
						poll: poll._id,
						message,
						imageUrl: totalVotes[0].voter.imageUrl,
						createdDate: new Date(),
						modifiedDate: new Date(),
						isRead: false,
					})
					createPromises.push(createPromise)
				}
			}
		})

		await Promise.all(createPromises)
	} catch (error) {
		logger.info('Notification checker error ', error)
	}
	logger.info('Notification job completed')
}

const getDateVariables = () => {
	let threeDaysAgo = new Date()
	threeDaysAgo.setDate(threeDaysAgo.getDate() - 2)

	let aMonthAgo = new Date()
	aMonthAgo.setMonth(aMonthAgo.getMonth() - 1)

	return { threeDaysAgo, aMonthAgo }
}
