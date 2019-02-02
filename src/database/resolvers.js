export default {
	Query: {
		getArticles: async (parent, args, newsDbService) => {
			const articles = await newsDbService.getArticles();
			return articles;
		}
	}
};
