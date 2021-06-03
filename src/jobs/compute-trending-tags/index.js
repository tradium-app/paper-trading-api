const { Poll, Tag } = require('../../db-service/database/mongooseSchema')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		let aMonthAgo = new Date()
		aMonthAgo.setMonth(aMonthAgo.getMonth() - 1)

		const polls = await Poll.find({ createdDate: { $gte: aMonthAgo }, status: { $ne: 'Deleted' } }, { tags: 1 })
			.lean()
			.sort({ modifiedDate: -1 })
			.limit(100)

		let pollTags = []
		polls.forEach((poll) => {
			pollTags = pollTags.concat(poll.tags)
		})

		const pollTagsGroupCount = pollTags.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {})

		const updatePromises = []
		Object.keys(pollTagsGroupCount).forEach((key) => {
			const updatePromise = Tag.updateOne({ tagId: key }, { count: pollTagsGroupCount[key] }, { upsert: true })
			updatePromises.push(updatePromise)
		})

		await Promise.all(updatePromises)
	} catch (error) {
		logger.info('Notification checker error ', error)
	}
	logger.info('Notification job completed')
}
