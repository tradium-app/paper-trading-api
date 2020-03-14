/* eslint-disable no-undef */
const sourceList = [
	{
		name: 'सेतोपाटी',
		link: 'https://setopati.com',
		logoLink: 'https://setopati.com/images/og-image.jpg',
		category: [
			{
				name: 'politics',
				path: '/politics',
			},
			{
				name: 'social',
				path: '/social',
			},
			{
				name: 'opinion',
				path: '/opinion',
			},
			{
				name: 'sports',
				path: '/sports',
			},
			{
				name: 'entertainment',
				path: '/art',
			},
		],
	},
	{
		name: 'दैनिक नेपाल',
		link: 'https://dainiknepal.com',
		logoLink: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzh7lprLde3-7eyyxDMPVhfSJkKEHn6N7qDMz6_KwUpd6pC8U8',
		category: [
			{
				name: 'news',
				path: '/section/latest-news',
			},
			{
				name: 'opinion',
				path: '/section/views',
			},
			{
				name: 'sports',
				path: '/section/sports',
			},
			{
				name: 'entertainment',
				path: '/section/kala',
			},

			{
				name: 'business',
				path: '/kinmel',
			},
		],
	},
	{
		name: 'कान्तिपुर',
		link: 'https://ekantipur.com',
		logoLink: 'https://pbs.twimg.com/profile_images/943652378875535360/K81bnaWT_400x400.jpg',
		category: [
			{
				name: 'news',
				path: '/news',
			},
			{
				name: 'business',
				path: '/business',
			},
			{
				name: 'opinion',
				path: '/opinion',
			},
			{
				name: 'sports',
				path: '/sports',
			},
			{
				name: 'entertainment',
				path: '/entertainment',
			},
		],
	},
	{
		name: 'रातोपाटी',
		link: 'https://ratopati.com',
		logoLink: 'https://i.imgur.com/h4EKX8S.png',
		category: [
			{
				name: 'news',
				path: '/category/news',
			},
			{
				name: 'business',
				path: '/economy',
			},
			{
				name: 'opinion',
				path: '/category/opinion',
			},
			{
				name: 'sports',
				path: '/category/sports',
			},
			{
				name: 'entertainment',
				path: '/entertainment',
			},
		],
	},
	{
		name: 'अनलाईन खबर',
		link: 'https://onlinekhabar.com',
		logoLink: 'https://www.onlinekhabar.com/wp-content/themes/onlinekhabar-2018/img/logoMainWht.png',
		category: [
			{
				name: 'business',
				path: '/business',
			},
			{
				name: 'opinion',
				path: '/category/opinion',
			},
			{
				name: 'sports',
				path: '/sports',
			},
			{
				name: 'entertainment',
				path: '/entertainment',
			},
		],
	},
	{
		name: 'BBC नेपाली',
		link: 'https://bbc.com/nepali',
		logoLink: 'https://news.files.bbci.co.uk/ws/img/logos/og/nepali.png',
		category: [
			{
				name: 'news',
				path: '/news',
			},
		],
	},
]

sourceList.forEach(function(source) {
	print('____________Updating existing source and inserting new source if not exist_________')
	printjson(source)
	db.sources.update({ link: source.link }, source, { upsert: true })
})
