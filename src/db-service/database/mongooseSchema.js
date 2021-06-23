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
				close: { type: Number, default: 0 },
				open: { type: Number, default: 0 },
				high: { type: Number, default: 0 },
				low: { type: Number, default: 0 },
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

const Game = mongoose.model(
	'Game',
	new Schema({
		symbol: String,
		company: String,
		timeStamp: { type: Number, unique: true, required: true },
		price_history: [
			{
				timeStamp: { type: Number, default: 0 },
				close: { type: Number, default: 0 },
				open: { type: Number, default: 0 },
				high: { type: Number, default: 0 },
				low: { type: Number, default: 0 },
			},
		],
		future_price_history: [
			{
				timeStamp: { type: Number, default: 0 },
				close: { type: Number, default: 0 },
				open: { type: Number, default: 0 },
				high: { type: Number, default: 0 },
				low: { type: Number, default: 0 },
			},
		],
		willPriceIncrease: Boolean,
		willPriceDecrease: Boolean,
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
	}),
)

module.exports = {
	Stock,
	Game,
}
