var express = require('express');
var router = express.Router();
var request = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  request('https://book-catalog-proxy-5.herokuapp.com/book?isbn=0596805527')
      .then(function(body) {
        var result = JSON.parse(body);
        res.render('index', { title: 'Express', items: result.items });
      })
      .catch(function (err) {
        console.error(err);
      });
});

module.exports = router;
