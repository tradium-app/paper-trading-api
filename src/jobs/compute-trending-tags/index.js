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

		const currentTime = Date.now()
		const keys = Object.keys(pollTagsGroupCount)

		for (let index = 0; index < keys.length; index++) {
			const key = keys[index]
			await Tag.updateOne(
				{ tagId: key },
				{ $set: { currentMonthCount: pollTagsGroupCount[key], modifiedDate: currentTime } },
				{ upsert: true, setDefaultsOnInsert: true },
			)
		}
	} catch (error) {
		logger.info('Compute Trending Tags error ', error)
	}
	logger.info('Compute Trending Tags job completed')
}
