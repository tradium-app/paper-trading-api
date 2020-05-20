require('dotenv').config()
const cheerio = require('cheerio')
const request = require('request')
const { newsPortalLink } = require('../../../src/constants/portal')
const { KANTIPUR, SETOPATI, RATOPATI, DAINIK_KHABAR, ONLINE_KHABAR, BBC_NEPALI } = newsPortalLink

process.setMaxListeners(Infinity)

const scrapeNewsLink = async (baseUrl, url) => {
	switch (baseUrl) {
		case KANTIPUR:
			return scrapeKantipurNewsLink(baseUrl, url)
		case SETOPATI:
			return scrapeSetoPatiLink(baseUrl, url)
		case RATOPATI:
			return scrapeRatoPatiLink(baseUrl, url)
		case DAINIK_KHABAR:
			return scrapeDainikNepalLinks(baseUrl, url)
		case ONLINE_KHABAR:
			return scrapeOnlineKhabarLinks(baseUrl, url)
		case BBC_NEPALI:
			return scrapeBBCNepaliLinks(baseUrl, url)
		default:
			return {
				error: {
					status: true,
				},
				links: null,
			}
	}
}

const scrapeKantipurNewsLink = (baseUrl, url) => {
	return new Promise((resolve, reject) => {
		request(url, function (err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					links: null,
				})
			} else {
				let $ = cheerio.load(body)
				const links = []
				$('article').each(function (index) {
					const link = $(this).find('h2>a').attr('href')
					links.push(link.startsWith('http') ? link : `${baseUrl}${link}`)
				})

				resolve({
					error: false,
					links: links.slice(0, 2),
				})
			}
		})
	})
}
const scrapeSetoPatiLink = (baseUrl, url) => {
	return new Promise((resolve, reject) => {
		request(url, function (err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					links: null,
				})
			} else {
				let $ = cheerio.load(body)
				const links = []
				$('.items').each(function (index) {
					const link = $(this).find('a').attr('href')
					links.push(link.startsWith('http') ? link : `${baseUrl}${link}`)
				})

				resolve({
					error: false,
					links: links.slice(0, 2),
				})
			}
		})
	})
}
const scrapeDainikNepalLinks = (baseUrl, url) => {
	return new Promise((resolve, reject) => {
		request(url, function (err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					links: null,
				})
			} else {
				let $ = cheerio.load(body)
				const links = []
				$('.news_loop').each(function (index) {
					const link = $(this).find('a').attr('href')
					links.push(link.startsWith('http') ? link : `${baseUrl}${link}`)
				})

				resolve({
					error: false,
					links: links.slice(0, 2),
				})
			}
		})
	})
}
const scrapeRatoPatiLink = (baseUrl, url) => {
	return new Promise((resolve, reject) => {
		request(url, function (err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					links: null,
				})
			} else {
				let $ = cheerio.load(body)
				const links = []
				$('.item-content').each(function (index) {
					const link = $(this).find('a').attr('href')
					links.push(link.startsWith('http') ? link : `${baseUrl}${link}`)
				})

				resolve({
					error: false,
					links: links.slice(0, 2),
				})
			}
		})
	})
}
const scrapeOnlineKhabarLinks = (baseUrl, url) => {
	return new Promise((resolve, reject) => {
		request(url, function (err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					links: null,
				})
			} else {
				let $ = cheerio.load(body)
				const links = []
				$('div.soft__wrap div.post__heading h2.title__small.post__title').each(function (index) {
					const link = $(this).find('a').attr('href')
					links.push(link.startsWith('http') ? link : `${baseUrl}${link}`)
				})

				resolve({
					error: false,
					links: links.slice(0, 10),
				})
			}
		})
	})
}

const scrapeBBCNepaliLinks = (baseUrl, url) => {
	return new Promise((resolve, reject) => {
		request(url, function (err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					links: null,
				})
			} else {
				let $ = cheerio.load(body)
				const links = []
				$('ul[class^="StoryPromoUl"] > li div h3').each(function () {
					const link = $(this).find('a').attr('href')
					links.push(link.startsWith('http') ? link : `${baseUrl}${link}`)
				})

				resolve({
					error: false,
					links: links.slice(0, 5),
				})
			}
		})
	})
}

module.exports = {
	scrapeNewsLink,
}
