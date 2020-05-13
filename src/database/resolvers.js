const _ = require('lodash')
const mongooseSchema = require('../db-service/database/mongooseSchema')

const { User, Article } = mongooseSchema
const { categories } = require('../config/category')
const { getSortedArticle } = require('../helper/articleHelper')
const getWeather = require('../weather')
const logger = require('../config/logger')

module.exports = {
	Query: {
		getArticles: async (parent, args, { Article }) => {
			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2001-01-01')
			args.criteria.lastArticleId = args.criteria.lastArticleId || '000000000000000000000000'

			const promises = categories.map(async (category) => {
				const _articles = await Article.find({
					category,
					link: { $ne: null },
					modifiedDate: { $gt: new Date(args.criteria.lastQueryDate) },
					_id: { $gt: args.criteria.lastArticleId },
				})
					.lean()
					.populate('source')
					.sort({ _id: -1 })
					.limit(20)

				return [..._articles]
			})

			const articles = await Promise.all(promises)
			const articleFlattened = _.flatten(articles)

			const articleList = articleFlattened.map((a) => {
				return {...a, source: {...a.source, logoLink: process.env.SERVER_BASE_URL + a.source.logoLink}}
			})
			const sortedArticles = getSortedArticle(articleList)

			return sortedArticles
		},

		getArticle: async (parent, { _id }) => {
			return await Article.findById(_id).populate('source')
		},

		getTweets: async (parent, args, { Tweet }) => {
			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2001-01-01')
			args.criteria.lastTweetId = args.criteria.lastTweetId || '000000000000000000000000'

			const tweets = await Tweet.find()
				.populate('twitterHandle')
				.sort({ publishedDate: -1 })
				.limit(100)

			return tweets
		},

		getLatestCoronaStats: async (parent, args, { CoronaStats }) => {
			const { CoronaDbService } = require('../db-service')
			return await CoronaDbService.getLatestStats()
		},

		getWeatherInfo: async (parent, args, { ipAddress }) => {
			try {
				if (ipAddress === '::1') ipAddress = '27.111.16.0'
				logger.debug(`Printing ip: ${ipAddress}`)

				const weatherInfo = await getWeather(ipAddress)
				weatherInfo.ipAddress = ipAddress

				return {
					ipAddress: ipAddress,
					temperature: weatherInfo.main.temp,
					condition: weatherInfo.weather[0].main,
					description: weatherInfo.weather[0].description,
					place: weatherInfo.name,
				}
			} catch (error) {
				logger.error(`Printing ip: ${ipAddress}`)
				throw error
			}
		},
	},

	Mutation: {
		storeFcmToken: async (parent, args) => {
			const {
				input: { fcmToken, countryCode, timeZone },
			} = args
			const user = await User.create({
				fcmToken,
				countryCode,
				timeZone,
			})
			return user
		},
	},
}
