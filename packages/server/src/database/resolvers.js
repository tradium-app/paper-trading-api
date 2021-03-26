/* eslint-disable eqeqeq */
const firebase = require('firebase')
const _ = require('lodash')
const mongooseSchema = require('../db-service/database/mongooseSchema')

const { News, Stock, User } = mongooseSchema
const { categories } = require('../config/category')
const logger = require('../config/logger')
const SourceConfig = require('../config/news-source-config.json')
const { calculateTotalWeights } = require('./calculateTotalWeights')

module.exports = {
	Query: {
		getStockNews: async (parent, args, { News }) => {
			// get stocks from users watchlist
			// get news for those stocks
			// limit only [5] news from each stock

			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2001-01-01')
			args.criteria.lastArticleId = args.criteria.lastArticleId || '000000000000000000000000'
			args.criteria.categories = args.criteria.categories || categories
			args.criteria.nid = args.criteria.nid || ''
			const promises = args.criteria.categories.map(async (category) => {
				const _articles = await Article.find({
					category: category.name,
					link: { $ne: null },
					modifiedDate: { $gt: new Date(args.criteria.lastQueryDate) },
					_id: { $gt: args.criteria.lastArticleId },
				})
					.lean()
					.sort({ _id: -1 })
					.limit(category.count || 20)

				const totalWeights = await calculateTotalWeights([..._articles], args.criteria.nid)

				return totalWeights
			})

			const articles = await Promise.all(promises)
			let articleFlattened = _.flatten(articles)
			articleFlattened = articleFlattened.sort((a, b) => b.totalWeight - a.totalWeight)

			const articleList = articleFlattened.map((article) => {
				const mySource = SourceConfig.find((x) => x.sourceName === article.sourceName)
				article.source = {
					_id: mySource.name,
					name: mySource.nepaliName,
					url: mySource.link,
					logoLink: process.env.SERVER_BASE_URL + mySource.logoLink,
				}
				return article
			})

			return articleList
		},

		getWatchList: async (parent, { _id }) => {
			return [{}]
		},
	},

	Mutation: {
		loginUser: async (parent, args, {}) => {
			const credential = firebase.auth.GoogleAuthProvider.credential(null, args.accessToken)
			const firebaseRes = await firebase.auth().signInWithCredential(credential)
			const firebaseUser = await UserDAO.readbyUid(firebaseRes.user.uid)

			if (firebaseUser) {
				return { success: true, id: firebaseUser.id }
			} else {
				const userObj = {
					name: firebaseRes.user.displayName,
					firebaseUid: firebaseRes.user.uid,
					profileImage: firebaseRes.user.photoURL,
					authProvider: credential.providerId,
				}

				const result = await User.create(userObj)

				return { success: true, id: result }
			}
		},
		addStockToWatchList: async (parent, args, { ipAddress }) => {
			const {
				input: { nid, fcmToken, countryCode, timeZone, createdDate, modifiedDate },
			} = args

			const response = await User.update(
				{ nid },
				{
					$set: {
						fcmToken,
						countryCode,
						timeZone,
						ipAddress,
						createdDate: createdDate || modifiedDate,
						modifiedDate: modifiedDate || createdDate,
					},
				},
				{ upsert: true },
			)

			return { success: !!response.ok }
		},
	},
}
