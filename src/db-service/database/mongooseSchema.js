const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.set('returnOriginal', false)

const User = mongoose.model(
	'User',
	new Schema({
		firebaseUid: { type: String, unique: true, required: true, trim: true },
		userUrlId: { type: String, unique: true, required: true, trim: true },
		name: { type: String, required: true, trim: true },
		authProvider: String,
		email: String,
		imageUrl: String,
		fcmToken: { type: String },
		countryCode: String,
		timeZone: String,
		ipAddress: String,
		title: String,
		shortBio: String,
		githubLink: String,
		linkedinLink: String,
		stackOverflowLink: String,
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		status: String,
	}),
)

const Poll = mongoose.model(
	'Poll',
	new Schema({
		pollUrlId: { type: String, unique: true, required: true, trim: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		question: { type: String, unique: true, required: true, trim: true },
		options: [
			{
				text: String,
				order: { type: Number, required: true },
				votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
				totalVotes: Number,
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
		status: { type: String, default: 'Draft' },
	}),
)

const Notification = mongoose.model(
	'Notification',
	new Schema({
		message: { type: String, required: true },
		poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		isRead: { type: Boolean, ref: 'User', default: false },
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
	}),
)

module.exports = {
	User,
	Poll,
	Notification,
}
