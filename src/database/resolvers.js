module.exports = {
	Query: {
		getArticles: async (parent, args, newsDbService) => {
			const articles = await newsDbService.getArticles();
			return articles;
		}
	}
};
