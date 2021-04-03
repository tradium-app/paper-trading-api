const { AllStocks } = require('../../db-service/database/mongooseSchema')
const axios = require('axios')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		const url = `https://cloud.iexapis.com/beta/ref-data/symbols?token=${process.env.IEX_API_TOKEN}`
		const response = await axios(url)

		if (response.data.length > 0) {
			await AllStocks.insertMany(response.data, { ordered: false })
		}

		logger.info(`All US based list of stocks fetched. ${response.data.length}`)
	} catch (error) {
		logger.error('Error while fetching list of stocks:', error)
	}
}
