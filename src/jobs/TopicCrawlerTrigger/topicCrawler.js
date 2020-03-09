const cheerio = require('cheerio')
const request = require('request')

const { newsPortalLink } = require('../../../src/constants/portal')
const { KANTIPUR, SETOPATI, RATOPATI, DAINIK_KHABAR, ONLINE_KHABAR, BBC_NEPALI } = newsPortalLink

const scrapeTopic = async baseUrl => {
	switch (baseUrl) {
		case SETOPATI:
			return scrapeSetoPatiTopic(baseUrl)
		case ONLINE_KHABAR:
			return scrapeOnlineKhabarTopic(baseUrl)
		case RATOPATI:
			return scrapeRatoPatiTopic(baseUrl)
		case DAINIK_KHABAR:
			return scrapeDainikbarTopic(baseUrl)
		case BBC_NEPALI:
			return scrapeBBCNepaliTopic(baseUrl)
		case KANTIPUR:
			return scrapeKantipurTopic(baseUrl)
	}
}

const scrapeSetoPatiTopic = url => {
	return new Promise((resolve, reject) => {
		request(url, function(err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					topics: null,
				})
			} else {
				let $ = cheerio.load(body)
				const topics = []
				$('#header > div.container.main-menu > div > div > div > ul li').each(function(index) {
					const topicText = $(this)
						.text()
						.trim()
					const anchorTagHref = $(this)
						.find('a')
						.attr('href')

					let topicPath = anchorTagHref
					topicPath = topicPath.startsWith('/') ? `${url}${topicPath}` : topicPath

					topics.push({
						topicText,
						topicPath,
					})
				})

				resolve({
					error: false,
					topics,
				})
			}
		})
	})
}

const scrapeOnlineKhabarTopic = url => {
	return new Promise((resolve, reject) => {
		request(url, function(err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					topics: null,
				})
			} else {
				let $ = cheerio.load(body)
				const topics = []
				$('#page nav > div.ok__container > div.twelve__cols--grid > div > nav > div.menu-primary-menu-container > ul > li').each(function(
					index,
				) {
					let topicPath = $(this)
						.find('a')
						.attr('href')
					let topicText = $(this)
						.find('a')
						.text()

					if (topicPath && topicText) {
						topicPath = topicPath.startsWith('/') ? `${url}${topicPath}` : topicPath

						topics.push({
							topicText,
							topicPath,
						})
					}
				})

				resolve({
					error: false,
					topics,
				})
			}
		})
	})
}

const scrapeRatoPatiTopic = url => {
	return new Promise((resolve, reject) => {
		request(url, function(err, res, body) {
			if (err) {
				console.log('error in rato pati topic crawler', err)
				reject({
					error: {
						status: true,
						stack: err,
					},
					topics: null,
				})
			} else {
				let $ = cheerio.load(body)
				const topics = []
				$('ul.load-responsive:first-child li#main-menu-items').each(function(index) {
					let li = $(this).first()
					let a = li.children('a')
					let topicPath = a.attr('href')
					let topicText = a.text().trim()
					topicPath = topicPath.startsWith('/') ? `${url}${topicPath}` : topicPath

					topics.push({
						topicPath,
						topicText,
					})
				})

				resolve({
					error: false,
					topics,
				})
			}
		})
	})
}

const scrapeKantipurTopic = url => {
	return new Promise((resolve, reject) => {
		request(url, function(err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					topics: null,
				})
			} else {
				let $ = cheerio.load(body)
				const topics = []
				$('section > div.row > div.cat_name').each(function(index) {
					const topicPath = $(this)
						.find('a')
						.attr('href')
					console.log(topicPath)
					const topicText = $(this)
						.find('a > div.catName')
						.text()
						.trim()

					topics.push({
						topicPath,
						topicText,
					})
				})

				resolve({
					error: false,
					topics,
				})
			}
		})
	})
}

const scrapeDainikbarTopic = url => {
	return new Promise((resolve, reject) => {
		request(url, function(err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					topics: null,
				})
			} else {
				let $ = cheerio.load(body)
				const topics = []
				$('#menu_div > ul > a').each(function(index) {
					const topicPath = $(this).attr('href')
					const topicText = $(this)
						.find('li')
						.text()
						.trim()

					topics.push({
						topicPath,
						topicText,
					})
				})

				resolve({
					error: false,
					topics,
				})
			}
		})
	})
}

const scrapeBBCNepaliTopic = url => {
	return new Promise((resolve, reject) => {
		request(url, function(err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					topics: null,
				})
			} else {
				let $ = cheerio.load(body)
				const topics = []
				$('#root > header > nav > div > div > ul > li').each(function(index) {
					let topicPath = $(this)
						.find('a')
						.attr('href')
					const topicText = $(this)
						.text()
						.trim()

					topicPath = topicPath.startsWith('/') ? `${url}${topicPath}` : topicPath

					topics.push({
						topicPath,
						topicText,
					})
				})

				resolve({
					error: false,
					topics,
				})
			}
		})
	})
}

module.exports = {
	scrapeTopic,
}
