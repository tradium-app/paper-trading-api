const firebase = require('firebase')
const jwt = require('jsonwebtoken')
const { User, Poll } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getTopPolls: async (parent, args, { userContext }) => {
			const polls = await Poll.find().populate('author').lean().sort({ createdDate: -1 }).limit(100)
			polls.forEach((poll) => {
				poll.options.forEach((option) => {
					option.totalVotes = option.votes.length
					option.selected = userContext && option.votes.some((v) => v == userContext._id)
				})
			})
			return polls
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

			const userObj = {
				name: firebaseRes.user.displayName,
				firebaseUid: firebaseRes.user.uid,
				imageUrl: firebaseRes.user.photoURL,
				email: firebaseRes.user.email,
				authProvider: credential.providerId,
			}

			const user = await User.findOneAndUpdate({ firebaseUid: firebaseRes.user.uid }, userObj, { upsert: true, new: true }).lean()
			userObj._id = user._id

			const accessToken = jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256' })
			return { success: true, user, accessToken }
		},
		createPoll: async (parent, args, { userContext }) => {
			const { pollInput } = args
			pollInput.author = userContext._id
			pollInput.options = pollInput.options.filter((o) => !!o.text)

			if (pollInput.question && pollInput.options.length > 1) {
				await Poll.create(pollInput)
				return { success: true }
			} else {
				return { success: false }
			}
		},
		submitVote: async (parent, args, { userContext }) => {
			let { pollVote } = args

			if (!pollVote || !userContext) {
				return { success: false }
			}

			const poll = await Poll.findByIdAndUpdate(
				pollVote.pollId,
				{
					$addToSet: { 'options.$[element1].votes': userContext._id },
					$pull: { 'options.$[element2].votes': userContext._id },
				},
				{
					arrayFilters: [{ 'element1._id': pollVote.optionId }, { 'element2._id': { $ne: pollVote.optionId } }],
					multi: false,
					upsert: true,
					new: true,
				},
			).lean()

			poll.options.forEach((option) => {
				option.totalVotes = option.votes.length
			})

			return { success: !!poll, poll }
		},
	},
}
