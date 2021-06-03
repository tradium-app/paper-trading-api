const { Poll, Tag } = require('../../db-service/database/mongooseSchema')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		let aMonthAgo = new Date()
		aMonthAgo.setMonth(aMonthAgo.getMonth() - 1)

		const polls = await Poll.find({ createdDate: { $gte: aMonthAgo }, status: { $ne: 'Deleted' } }, { tags: 1 }).limit(100000)

		let pollTags = []
		polls.forEach((poll) => {
			pollTags = pollTags.concat(poll.tags)
		})

		const pollTagsGroupCount = pollTags.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {})

		Tag.updateMany({}, { currentMonthCount: 0 }, { upsert: true })

		const updatePromises = []
		const currentTime = Date.now()
		Object.keys(pollTagsGroupCount).forEach((key) => {
			const updatePromise = Tag.updateOne(
				{ tagId: key },
				{ currentMonthCount: pollTagsGroupCount[key], modifiedDate: currentTime },
				{ upsert: true },
			)
			updatePromises.push(updatePromise)
		})

		await Promise.all(updatePromises)
	} catch (error) {
		logger.info('Notification checker error ', error)
	}
	logger.info('Notification job completed')
}
