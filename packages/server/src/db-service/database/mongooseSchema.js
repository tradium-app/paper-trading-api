const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expiryTime = 604800

const User = mongoose.model(
	'User',
	new Schema({
		hid: { type: String, unique: true },
		firebaseUid: String,
		profileImageUrl: String,
		name: String,
		authProvider: String,
		fcmToken: { type: String, unique: true },
		countryCode: String,
		timeZone: String,
		ipAddress: String,
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
		price: { type: Number, unique: true },
		change: { type: Number, unique: true },
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
		summary: String,
		relatedStockSymbols: { type: String, required: true },
		relatedStocks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Stock' },
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
