const firebase = require('firebase')
const { User, Poll } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getTopPolls: async (parent, args) => {
			return await Poll.find().lean().sort({ createdDate: -1 }).limit(100)
		},
		getUserProfile: async (parent, args) => {
			const user = await User.find().lean().limit(1)
			user.pollsCreated = await Poll.find({ 'author._id': user._id }).lean().sort({ createdDate: -1 }).limit(20)
			return user
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
					imageUrl: firebaseRes.user.photoURL,
					email: firebaseRes.user.email,
					authProvider: credential.providerId,
				}

				const userCreated = await User.create(userObj)
				return { success: true, user: userCreated }
			}
		},
		createPoll: async (parent, args, { uid }) => {
			let { pollInput } = args
			await Poll.create(pollInput)

			return { success: true }
		},
	},
}
