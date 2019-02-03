'use strict';
module.exports = function(app) {
  var news = require('../controllers/newsController');

  // news Routes
  app.route('/news')
    .get(news.getArticles)
    .post(news.create_a_news);


  app.route('/news/:newsId')
    .get(news.read_a_news)
    .put(news.update_a_news)
    .delete(news.delete_a_news);
};
