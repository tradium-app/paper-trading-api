const cheerio = require('cheerio')
const request = require('request')
const htmlToText = require('html-to-text')

module.exports = function manualScrapper(link, logoLink, selector, context) {
	return new Promise((resolve, reject) => {
		request(link, function (err, res, body) {
			if (err) {
				reject({
					error: {
						status: true,
						stack: err,
					},
					data: null,
				})
			} else {
				const $ = cheerio.load(body)
				const title = $(selector.TITLE).text()
				const shortDescription = $(selector.EXCERPT).text().slice(0, 300)
				const imageLink = $(selector.LEAD_IMAGE.PATH).attr(selector.LEAD_IMAGE.SELECTOR) || logoLink

				const content = htmlToText
					.fromString($(selector.CONTENT).html(), {
						wordwrap: false,
						ignoreImage: true,
						ignoreHref: true,
						preserveNewlines: false,
					})
					.trim()
					.slice(0, 2000)

				const publishedDate = new Date()
				const topic = $(selector.TOPIC).text().trim()
				resolve({
					error: false,
					data: {
						title,
						shortDescription,
						imageLink,
						content,
						link,
						publishedDate,
						topic,
					},
				})
			}
		})
	})
}
