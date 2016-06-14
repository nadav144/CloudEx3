var express = require('express');
var router = express.Router();

// create a file only file logger
var log = require('simple-node-logger').createSimpleFileLogger('project.log');

/* GET home page. */
router.all('/', function(req, res, next) {

  var ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  var userAgent = req.header("User-Agent");

  log.info(ip + ";" + userAgent + ";" + req.method);
  res.render('index', { title: 'Express' });
});

module.exports = router;
