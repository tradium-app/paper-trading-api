/* eslint-disable eqeqeq */
const firebase = require('firebase')
const { News, Stock, User } = require('../db-service/database/mongooseSchema')
const { categories } = require('../config/category')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getStockNews: async (parent, args) => {
			// get stocks from users watchlist
			// get news for those stocks
			// limit only [5] news from each stock

			const news = News.find().lean().sort({ publishedDate: -1 }).limit(20)

			return news
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
