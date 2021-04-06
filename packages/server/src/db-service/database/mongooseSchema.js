const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expiryTime = 604800

mongoose.set('returnOriginal', false)

const User = mongoose.model(
	'User',
	new Schema({
		hid: { type: String, unique: true },
		firebaseUid: String,
		profileImageUrl: String,
		name: String,
		authProvider: String,
		fcmToken: { type: String },
		countryCode: String,
		timeZone: String,
		ipAddress: String,
		watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }],
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		status: String,
	}),
)

const Stock = mongoose.model(
	'Stock',
	new Schema({
		symbol: { type: String, unique: true },
		company: String,
		price: { type: Number, default: 0 },
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

const News = mongoose.model(
	'News',
	new Schema({
		id: String,
		source: String,
		url: { type: String, unique: true, required: true },
		imageUrl: String,
		headline: { type: String, unique: true, required: true },
		summary: String,
		relatedStockSymbols: String,
		relatedStocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }],
		hasPaywall: Boolean,
		createdAt: { type: Date, expires: expiryTime, default: Date.now },
		publishedDate: { type: Date },
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
	}),
)

module.exports = {
	User,
	Stock,
	News,
}
