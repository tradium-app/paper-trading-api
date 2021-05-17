const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.set('returnOriginal', false)

const User = mongoose.model(
	'User',
	new Schema({
		googleId: String,
		firebaseUid: String,
		name: String,
		authProvider: String,
		imageUrl: String,
		fcmToken: { type: String },
		countryCode: String,
		timeZone: String,
		ipAddress: String,
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		status: String,
	}),
)

const Poll = mongoose.model(
	'Poll',
	new Schema({
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		question: { type: String, unique: true, required: true, trim: true },
		options: [
			{
				text: String,
				count: Number,
			},
		],
		comments: [
			{
				author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				text: String,
			},
		],
		tags: [String],
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		status: String,
	}),
)

module.exports = {
	User,
	Poll,
}
