const firebase = require('firebase')
const jwt = require('jsonwebtoken')
const { User, Poll, Tag, Notification } = require('../db-service/database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getPoll: async (_, { userUrlId, pollUrlId }, { userContext }) => {
			const author = await User.findOne({ userUrlId })

			const poll = await Poll.findOne({ pollUrlId, author: author._id }).populate('author').lean()

			calculatePollVotes([poll], userContext?._id)
			return poll
		},
		getTopPolls: async (_, args, { userContext }) => {
			let polls = await Poll.find({ status: 'Published' }).populate('author').lean().sort({ createdDate: -1 }).limit(100)
			polls = polls.filter((p) => p.author != null)

			calculatePollVotes(polls, userContext?._id)
			return polls
		},
		getTopTags: async (_, { searchText }, {}) => {
			const tags = await Tag.find({ tagId: { $regex: '^' + searchText }, status: 'Active' }, { tagId: 1, currentMonthCount: 1 })
				.sort({ modifiedDate: -1 })
				.limit(100)

			return tags
		},
		getUserProfile: async (_, { userUrlId }, { userContext }) => {
			const user = await User.findOne({ userUrlId: userUrlId.toLowerCase() }).lean()

			if (!user) return null

			const allowedStatus = ['Published']
			if (userUrlId == userContext?.userUrlId) {
				allowedStatus.push('Draft')
			}

			user.pollsCreated = await Poll.find({ author: user._id, status: { $in: allowedStatus } })
				.populate('author')
				.lean()
				.sort({ createdDate: -1 })
				.limit(20)

			calculatePollVotes(user.pollsCreated, userContext?._id)
			return user
		},
		getNotifications: async (_, {}, { userContext }) => {
			if (!userContext) {
				return null
			}

			const notifications = await Notification.find({ user: userContext._id })
				.populate('user')
				.populate('poll')
				.lean()
				.sort({ modifiedDate: -1 })
				.limit(100)
			return notifications
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

			let user = await User.findOneAndUpdate({ firebaseUid: firebaseRes.user.uid }, userObj, { upsert: true, new: true }).lean()
			userObj._id = user._id

			if (!user.userUrlId) {
				userObj.userUrlId = firebaseRes.user.displayName.toLowerCase().replace(/[^a-zA-z0-9]/gm, '-')

				const existingUsers = await User.find({ userUrlId: userObj.userUrlId })

				if (existingUsers.length > 0) {
					userObj.userUrlId = userObj.userUrlId + '-' + existingUsers.length
				}

				user = await User.findOneAndUpdate({ firebaseUid: firebaseRes.user.uid }, { userUrlId: userObj.userUrlId }, { new: true }).lean()
			}

			userObj.userUrlId = user.userUrlId
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
			if (!userContext) {
				return { success: false, message: 'Please Login to delete.' }
			}
			pollInput.pollUrlId = pollInput.question.replace(/[^a-zA-z0-9?.]/gm, '-').replace(/[?.]/gm, '')
			pollInput.author = userContext._id
			pollInput.options = pollInput.options.filter((o) => !!o.text)

			const uniqueOptions = pollInput.options.map((o) => o.order).filter((order, index, inputArray) => inputArray.indexOf(order) == index)
			if (pollInput.options.length > uniqueOptions.length) {
				return { success: false, message: 'Multiple options have same order.' }
			}

			if (pollInput.question && pollInput.options.length > 1) {
				let response = null
				if (pollInput._id) {
					response = await Poll.updateOne({ _id: pollInput._id }, pollInput)
				} else {
					response = await Poll.create(pollInput)
				}
				return { success: response.ok && response.n == 1 }
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
			option.selected = userId && option.votes.some((v) => v.toString() == userId.toString())
		})
	})

	return polls
}
