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
					const lastIndexOfSlash = anchorTagHref.lastIndexOf('/')
					let topicPath = anchorTagHref.slice(lastIndexOfSlash, anchorTagHref.length)
					topicPath = topicPath.startsWith('/www') ? url : topicPath

					if (topicPath.startsWith('/') || topicPath.startsWith(url)) {
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
				$('ul#primary-menu > li').each(function(index) {
					const topicText = $(this)
						.text()
						.trim()
					const anchorTagHref = $(this)
						.find('a')
						.attr('href')
					const lastIndexOfSlash = anchorTagHref.lastIndexOf('/')
					let topicPath = anchorTagHref.slice(lastIndexOfSlash, anchorTagHref.length)
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
				$('#main-menu > ul > li').each(function(index) {
					console.log('xireko xa........')
					const topicText = $(this)
						.text()
						.trim()
					const anchorTagHref = $(this)
						.find('a')
						.attr('href')
					const lastIndexOfSlash = anchorTagHref.lastIndexOf('/')
                    let topicPath = anchorTagHref.slice(lastIndexOfSlash, anchorTagHref.length)
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

const scrapeKantipurTopic = url => {}

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
                    const topicText = $(this).find('li').text().trim()

                    topics.push({
                        topicPath,
                        topicText
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
                    const topicPath = $(this).find('a').attr('href')
                    const topicText = $(this).text().trim()

                    topics.push({
                        topicPath,
                        topicText
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
