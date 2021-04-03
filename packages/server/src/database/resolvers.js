/* eslint-disable eqeqeq */
const firebase = require('firebase')
const { News, Stock, User, AllStocks } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getStockNews: async (parent, args) => {
			// todo: limit only [5] news from each stock
			const watchlist = (await User.findOne({})).watchlist

			const news = await News.find({ relatedStocks: { $in: watchlist } })
				.populate('relatedStocks')
				.lean()
				.sort({ publishedDate: -1 })
				.limit(20)

			return news
		},

		getWatchList: async (parent, args, { uid }) => {
			const watchlist = (await User.findOne({}).populate('watchlist')).watchlist

			return watchlist
		},

		searchStocks: async (parent, args) => {
			const { searchTerm } = args
			const regexTerm = `\\b${searchTerm}`

			return AllStocks.find({
				$or: [{ symbol: { $regex: regexTerm, $options: 'gmi' } }, { company: { $regex: regexTerm, $options: 'gmi' } }],
			}).limit(20)
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
		addStockToWatchList: async (parent, args, { uid }) => {
			let { symbol: symbol } = args
			symbol = symbol.toUpperCase()

			const validStock = await AllStocks.findOne({ symbol })

			if (!validStock) {
				return { success: false, message: 'Invalid Stock Symbol' }
			}

			const stock = await Stock.findOneAndUpdate({ symbol }, { $set: { symbol } }, { upsert: true, new: true })

			const firstUser = await User.findOne({})
			uid = firstUser._id

			const response = await User.updateOne(
				{ _id: uid },
				{
					$addToSet: {
						watchlist: stock,
					},
				},
			)

			return { success: !!response.ok }
		},
	},
}
