const firebase = require('firebase')
const { User, Poll } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getTopPolls: async (parent, args) => {
			const news = await Poll.find().lean().sort({ createdDate: -1 }).limit(20)
			return news
		},
	},

	Mutation: {
		loginUser: async (parent, args) => {
			const credential = firebase.auth.GoogleAuthProvider.credential(null, args.accessToken)
			const firebaseRes = await firebase.auth().signInWithCredential(credential)
			const firebaseUser = await User.findOne({ firebaseUid: firebaseRes.user.uid })

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
		createPoll: async (parent, args, { uid }) => {
			let { pollInput } = args
			await Poll.create(pollInput)

			return { success: true }
		},
	},
}
