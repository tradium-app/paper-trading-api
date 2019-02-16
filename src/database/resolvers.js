module.exports = {
	Query: {
		getArticles: async (parent, args, { Article }) => {
			const articles = await Article
				.find({ 'link': { $ne: null } })
				.sort({ _id: -1 })
				.limit(100);
			return articles;
		}
	}
};
