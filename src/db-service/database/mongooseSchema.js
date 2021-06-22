const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.set('returnOriginal', false)

const Stock = mongoose.model(
	'Stock',
	new Schema({
		symbol: { type: String, unique: true },
		company: String,
		price: { type: Number, default: 0 },
		price_history: [
			{
				timeStamp: { type: Number, default: 0 },
				price: { type: Number, default: 0 },
			},
		],
		changePercent: { type: Number, default: 0 },
		marketCap: { type: Number, default: 0 },
		peRatio: { type: Number, default: 0 },
		week52High: { type: Number, default: 0 },
		week52Low: { type: Number, default: 0 },
		ytdChangePercent: { type: Number, default: 0 },
		exchange: String,
		type: String,
		region: String,
		currency: String,
		isEnabled: Boolean,
		shouldRefresh: { type: Boolean, default: false },
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
	}),
)

module.exports = {
	Stock,
}
