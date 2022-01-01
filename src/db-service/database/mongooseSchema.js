const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.set('returnOriginal', false)

const StockSchema = new Schema({
	symbol: { type: String, unique: true },
	company: String,
	price: { type: Number, default: 0 },
	price_history: [
		{
			timeStamp: { type: Number, default: 0 },
			close: { type: Number, default: 0 },
			open: { type: Number, default: 0 },
			high: { type: Number, default: 0 },
			low: { type: Number, default: 0 },
			volume: { type: Number, default: 0 },
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
})
StockSchema.index({ _id: 1, 'price_history.timeStamp': 1 }, { unique: true })

const Stock = mongoose.model('Stock', StockSchema)

module.exports = {
	Stock,
}
