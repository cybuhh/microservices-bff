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
var esi = require('nodesi');

/* GET home page. */
router.get('/', function(req, res) {
    var reqId = req.headers['x-request-id'] || 'foo';
    goodGuy(process.env.API_URL + '/book/0596805527')
      .then(function(result) {
          return new Promise(function(resolve, reject) {
              res.render('book', { title: 'Express', item: result.body,
                  reqId: reqId,
                  partials: {
                      layout: 'layout'
                  }
              }, function(err, html) {
                  if (err) {
                      return reject(err);
                  }
                  return resolve(html);
              });
          });
      })
      .then(function(html) {
          return new esi().process(html, {
              headers: {
                  'custom-request-id': reqId
              }
          });
      })
      .then(function(html) {
          return res.send(html);
      })
      .catch(function (err) {
        console.error(err);
      });
});

module.exports = router;
