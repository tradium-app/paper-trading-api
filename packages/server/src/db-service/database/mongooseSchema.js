const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expiryTime = 604800

const Article = mongoose.model(
	'Article',
	new Schema({
		id: String,
		title: { type: String, required: true, unique: true },
		link: { type: String, unique: true, required: true },
		imageLink: { type: String, required: true, unique: true },
		isHeadline: Boolean,
		shortDescription: String,
		category: String,
		content: String,
		sourceName: String,
		hostIp: String,
		publishedDate: { type: Date, default: Date.now },
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		topic: { type: String },
		createdAt: { type: Date, expires: expiryTime, default: Date.now },
		nouns: [String],
		tags: [String],
		weights: {
			source: Number,
			category: Number,
			date: Number,
			user: Number,
		},
		likes: [
			{
				nid: String,
			},
		],
		dislikes: [
			{
				nid: String,
			},
		],
	}),
)

const Tweet = mongoose.model(
	'Tweet',
	new Schema({
		tweetId: { type: String, required: true, unique: true },
		handle: { type: String },
		text: String,
		createdAt: { type: Date, expires: expiryTime, default: Date.now },
		publishedDate: { type: Date },
		name: String,
		profileImage: String,
		description: String,
	}),
)

const User = mongoose.model(
	'User',
	new Schema({
		nid: { type: String, unique: true },
		fcmToken: { type: String, unique: true },
		countryCode: String,
		timeZone: String,
		ipAddress: String,
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		status: String,
	}),
)

const Notification = mongoose.model(
	'Notification',
	new Schema({
		article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		createdAt: { type: Date, default: Date.now() },
		updatedAt: { type: Date, default: Date.now() },
	}).index({ article: 1, user: 1 }, { unique: true }),
)

const Topic = mongoose.model(
	'Topic',
	new Schema({
		id: String,
		topicText: String,
		topicPath: String,
	}),
)

const ReadArticle = mongoose.model(
	'ReadArticles',
	new Schema({
		nid: { type: String },
		article: [
			{
				articleId: String,
				category: String,
				createdDate: { type: Date, default: Date.now },
			},
		],
	}),
)

const Like = mongoose.model(
	'Like',
	new Schema({
		nid: String,
		articleId: String,
		category: String,
	}),
)

const Dislike = mongoose.model(
	'Dislike',
	new Schema({
		nid: String,
		articleId: String,
		category: String,
	}),
)

module.exports = {
	User,
	Tweet,
	Article,
	Notification,
	Topic,
	ReadArticle,
	Like,
	Dislike,
}
