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

/* GET home page. */
router.get('/', function(req, res) {
    goodGuy(process.env.API_URL + '/book/0596805527')
      .then(function(result) {
        res.render('book', { title: 'Express', item: result.body,
            partials: {
                layout: 'layout'
            }});
      })
      .catch(function (err) {
        console.error(err);
      });
});

module.exports = router;
