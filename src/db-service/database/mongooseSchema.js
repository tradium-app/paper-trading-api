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

const PollSchema = new Schema({
	pollUrlId: { type: String, unique: true, required: true, trim: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	question: { type: String, unique: true, required: true, trim: true },
	options: [
		{
			text: { type: String, required: true, trim: true },
			order: { type: Number, required: true },
			votes: [
				{
					voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
					votingTime: { type: Date, default: Date.now },
				},
			],
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
})
PollSchema.index({ question: 'text', 'options.text': 'text', tags: 'text' })

PollSchema.path('options').validate(function (options) {
	if (!options) {
		return false
	} else if (options.length < 2) {
		return false
	}
	return true
}, 'Poll needs to have at least two options')

const Poll = mongoose.model('Poll', PollSchema)

const Tag = mongoose.model(
	'Tag',
	new Schema({
		tagId: { type: String, unique: true, required: true },
		currentMonthCount: { type: Number, required: true, default: 0 },
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		status: { type: String, default: 'Active' },
	}),
)

const Notification = mongoose.model(
	'Notification',
	new Schema({
		message: { type: String, required: true },
		imageUrl: String,
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
	Tag,
	Notification,
}
