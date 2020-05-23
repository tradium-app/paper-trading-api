const { TwitterHandle } = require('../database/mongooseSchema')
const TwitterHandles = require('./twitter-handles')
require('../initialize')

const TwitterHandlesUpdate = async () => {
	const resultPromises = TwitterHandles.map(async (handle) => {
		return TwitterHandle.updateOne({ handle: handle.handle }, handle, { upsert: true })
	})

	return Promise.all(resultPromises)
}

async function waitForUpdates() {
	return TwitterHandlesUpdate()
}

waitForUpdates().then(() => {
	console.log('db updates done')
})
