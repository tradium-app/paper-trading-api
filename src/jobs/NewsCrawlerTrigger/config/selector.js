const selector = {
	kantipur: {
		TITLE: 'article .article-header > h1',
		EXCERPT: 'article .description > p',
		LEAD_IMAGE: {
			PATH: 'article.normal div.description div.image figure img',
			SELECTOR: 'data-src',
		},
		CONTENT: 'article.normal div.description',
		TOPIC: 'article.normal .article-header > div.cat_name > a'
	},
	ratopati: {
		TITLE: '.article-head > h1',
		EXCERPT: '.ratopati-table-border-layout p:first-child',
		LEAD_IMAGE: {
			PATH: '.img-with-no-margin img',
			SELECTOR: 'src',
		},
		CONTENT: '.ratopati-table-border-layout',
		TOPIC: '#content > div > div.ot-content-with-sidebar-right > div.col-md-9 > nav > ol > li.breadcrumb-item.active > a'
	},
	setopati: {
		TITLE: 'section.news-detail-section div.title-names span.news-big-title',
		EXCERPT: '#content > div.container > div > aside.left-side > div.row > div > div.editor-box > p:nth-child(2)',
		LEAD_IMAGE: {
			PATH: 'section.news-detail-section div.featured-images figure img',
			SELECTOR: 'src',
		},
		CONTENT: 'aside.left-side div.detail-box div.editor-box',
		TOPIC: '#header > div.container.main-menu > div > div > div > ul > li > a.selected'
	},
	dainik: {
		TITLE: 'div#sing_left div#sing_cont h1.inside_head',
		EXCERPT: 'div#sing_left div#sing_cont div.content p:nth-child(2)',
		LEAD_IMAGE: {
			PATH: 'div#sing_left div#sing_cont div.content img',
			SELECTOR: 'src',
		},
		CONTENT: 'div#sing_left div#sing_cont div.content p',
		TOPIC: 'div#the_body #menu_div > ul > a > li.mactive'
	},
	onlinekhabar: {
		TITLE: 'h2.mb-0',
		EXCERPT: 'div.main__read--content p:first-child',
		LEAD_IMAGE: {
			PATH: 'div.col.colspan3.dtl-img img',
			SELECTOR: 'src',
		},
		CONTENT: 'div.main__read--content p',
		TOPIC: '#main > section > div > div.nws__title--card > div.custom_breadcrumb > a:nth-child(2)'
	},
	bbcnepali: {
		TITLE: 'div.story-body h1.story-body__h1',
		EXCERPT: 'div.story-body div.story-body__inner p.story-body__introduction',
		LEAD_IMAGE: {
			PATH: 'div.story-body div.story-body__inner figure > span > img',
			SELECTOR: 'src',
		},
		CONTENT: 'div.story-body div.story-body__inner p',
	},
}

module.exports = {
	selector,
}
