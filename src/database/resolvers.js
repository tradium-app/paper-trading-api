const firebase = require('firebase')
const jwt = require('jsonwebtoken')
const { User, Poll } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getTopPolls: async (_, args, { userContext }) => {
			const polls = await Poll.find().populate('author').lean().sort({ createdDate: -1 }).limit(100)

			calculatePollVotes(polls, userContext && userContext._id)
			return polls
		},
		getUserProfile: async (_, { userId }, { userContext }) => {
			const user = await User.findById(userId || userContext._id)
				.lean()
				.limit(1)

			user.pollsCreated = await Poll.find({ author: user._id }).populate('author').lean().sort({ createdDate: -1 }).limit(20)

			calculatePollVotes(user.pollsCreated, userId || userContext._id)
			return user
		},
	},

	Mutation: {
		loginUser: async (_, args) => {
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
		updateProfile: async (parent, { userInput }, { userContext }) => {
			if (!userContext) {
				return { success: false, message: 'Please Login first.' }
			}

			const response = await User.findByIdAndUpdate(userContext._id, userInput, { upsert: false }).lean()

			return { success: !!response }
		},
		createPoll: async (parent, { pollInput }, { userContext }) => {
			pollInput.author = userContext._id
			pollInput.options = pollInput.options.filter((o) => !!o.text)

			if (pollInput.question && pollInput.options.length > 1) {
				await Poll.create(pollInput)
				return { success: true }
			} else {
				return { success: false }
			}
		},
		deletePoll: async (parent, { pollId }, { userContext }) => {
			if (!userContext) {
				return { success: false, message: 'Please Login to delete.' }
			}
			const response = await Poll.deleteOne({ _id: pollId, author: userContext._id })

			return { success: response.ok && response.deletedCount == 1 }
		},
		submitVote: async (parent, args, { userContext }) => {
			let { pollVote } = args

			if (!pollVote || !userContext) {
				return { success: false, message: 'Please Login to vote.' }
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

const calculatePollVotes = (polls, userId) => {
	polls.forEach((poll) => {
		poll.options.forEach((option) => {
			option.totalVotes = option.votes.length
			option.selected = userId && option.votes.some((v) => v == userId)
		})
	})

	return polls
}
