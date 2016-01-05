var express = require('express');
var router = express.Router();
var goodGuyLib = require('good-guy-http');
var goodGuy = goodGuyLib({
    maxRetries: 2,
    json: true,
    cache: goodGuyLib.inMemoryCache(10),
    defaultCaching: {                  // default caching settings for responses without Cache-Control
        cached: true,                    // - whether such responses should be cached at all
        timeToLive: 5000,                // - for how many ms
        mustRevalidate: false            // - is it OK to return a stale response and fetch in the background?
    }
});
var jsonpath = require('jsonpath');

/* GET home page. */
router.get('/:isbn', function(req, res) {
    goodGuy('https://book-catalog-proxy-2.herokuapp.com/book?isbn=' + req.params.isbn)
      .then(function(result) {
          var response = {
              title: jsonpath.query(result.body, '$.items[*]..title'),
              thumbnail: jsonpath.query(result.body, '$.items[*]..smallThumbnail')
          };

          res.json(response);
      })
      .catch(function (err) {
        console.error(err);
      });
});

module.exports = router;
