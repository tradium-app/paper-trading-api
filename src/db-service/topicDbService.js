const { Topic } = require('./database/mongooseSchema')

module.exports = {
	saveTopic: async topic => {
		const res = await Topic.create(topic)
		return res
	},
	saveTopics: async topics => {
		try {
			const topicsDoc = await Topic.insertMany(topics)
			return topicsDoc
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				console.log('________ignored duplicates________')
			} else {
				console.log(error)
			}
		}
	},
	getTopic: async (conditions = {}) => {
		const topic = await Topic.find(conditions)
		return topic
	},
}
