'use strict';


var mongoose = require('mongoose'),
news = mongoose.model('news');

exports.list_all_news = function(req, res) {
  news.find({}, function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};




exports.create_a_news = function(req, res) {
  var new_news = new news(req.body);
  new_news.save(function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};


exports.read_a_news = function(req, res) {
  news.findById(req.params.newsId, function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};


exports.update_a_news= function(req, res) {
  news.findOneAndUpdate({_id: req.params.newsId}, req.body, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json(news);
  });
};


exports.delete_a_news = function(req, res) {


  news.remove({
    _id: req.params.newsId
  }, function(err, news) {
    if (err)
      res.send(err);
    res.json({ message: 'news successfully deleted' });
  });
};
