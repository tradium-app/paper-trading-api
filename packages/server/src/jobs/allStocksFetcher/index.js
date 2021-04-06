const { Stock } = require('../../db-service/database/mongooseSchema')
const axios = require('axios')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		const url = `https://cloud.iexapis.com/beta/ref-data/symbols?token=${process.env.IEX_API_TOKEN}`
		const response = await axios(url)

		if (response.data.length > 0) {
			const stocks = response.data.map((s) => {
				return {
					...s,
					company: s.name,
					exchange: s.exchange,
					type: s.type,
					region: s.region,
					currency: s.currency,
					isEnabled: s.isEnabled,
					shouldRefresh: false,
					modifiedDate: s.date,
				}
			})

			try {
				await Stock.insertMany(stocks, { ordered: false })
			} catch {}

			logger.info(`All US based list of stocks fetched. ${response.data.length}`)
		}
	} catch (error) {
		logger.error('Error while fetching list of stocks:', error)
	}
}
