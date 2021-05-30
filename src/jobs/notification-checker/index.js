const { Poll, Notification } = require('../../db-service/database/mongooseSchema')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		const polls = await Poll.find().populate('author').populate('options.votes').lean().sort({ modifiedDate: -1 }).limit(100)

		var twoDaysAgo = new Date()
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
		const upsertPromises = []

		polls.forEach((poll) => {
			let totalVotes = poll.options?.reduce((totalVoters, option) => {
				return { votes: totalVoters.votes.concat(option.votes) }
			}).votes
			totalVotes = totalVotes.filter((vote) => vote._id.toString() != poll.author._id.toString())

			if (poll.author && totalVotes.length > 0) {
				let message = ``
				const messageSuffix = `answered your poll. "${poll.question.substring(0, 100)}.." Please take a look.`
				let userNames = []

				for (let index = 0; index <= 2 && index < totalVotes.length; index++) {
					userNames[index] = totalVotes[index].name.split(' ')[0]
				}

				if (totalVotes.length > 2) {
					message = `${userNames[0]}, ${userNames[1]} and ${totalVotes.length - 2} more people have ${messageSuffix}`
				} else if (totalVotes.length == 2) {
					message = `${userNames[0]} and ${userNames[1]} have ${messageSuffix}`
				} else {
					message = `${userNames[0]} has ${messageSuffix}`
				}

				const upsertPromise = Notification.updateOne(
					{ poll: poll._id, createdDate: { $gte: twoDaysAgo } },
					{ user: poll.author._id, poll: poll._id, message, imageUrl: totalVotes[0].imageUrl, createdDate: new Date() },
					{ upsert: true },
				)

				upsertPromises.push(upsertPromise)
			}
		})

		await Promise.all(upsertPromises)
	} catch (error) {
		logger.info('Notification checker error ', error)
	}
	logger.info('Notification job completed')
}
