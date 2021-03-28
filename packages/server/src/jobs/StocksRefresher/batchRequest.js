const path = require('path')
require('dotenv').config({
	path: path.join(__dirname, '../../../.env'),
})

const axios = require('axios')

module.exports = async function (symobls) {
	symobls = symobls.join()
	const iex_token = process.env.IEX_API_TOKEN

	const url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symobls}&types=quote,news&last=5&token=${iex_token}`
	return axios(url)
}
