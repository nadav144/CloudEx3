var express = require('express');
var router = express.Router();
var fs = require('fs');

var textfilename = "textfile.txt";

// create a file only file logger
var SimpleNodeLogger = require('simple-node-logger'),
    opts = {
      logFilePath:'project.log',
      timestampFormat:'YYYY MM DD HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger( opts );

var SimpleNodeLogger = require('simple-node-logger'),
    opts = {
      logFilePath:'filesize.log',
      timestampFormat:'YYYY MM DD HH:mm:ss'
    },
    filesizelog = SimpleNodeLogger.createSimpleLogger( opts );




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
//
// router.all('/newfile', function (req, res, next) {
//     fs.writeFile(textfilename, "Hey there!", function(err) {
//         if(err) {
//             return console.log(err);
//         }
//
//         console.log("The file was saved!");
//     });
// });

router.all ('/text', function (req, res, next) {
  console.log("IN PUT");
  if (req.method !== "PUT") {
    next();
  } else {
    if (req.body.text) {
      var toAppend = req.body.text;
      fs.appendFile(textfilename, toAppend + "\n", function (err) {
        if (err) {
          return console.log(err);
        } else {
          logFileSize();
        }

      })
    } else {
      return console.log("no param 'text' found");
    }
    res.end();
  }
});

router.all ('/text/:rows', function (req, res, next) {
  console.log("IN GET");
  if (req.method !== "GET") {
    next();
  } else {
    if (req.params.rows) {
      var rows = req.params.rows;
      fs.readFile(textfilename, 'utf-8', function(err, data) {
        if (err){
          return console.log(err);
        }
        var lines = data.trim().split('\n');
        var lastLines = lines.slice(Math.max(lines.length - rows, 1));

        res.write(lastLines.join("\n"));
        res.end();
      });
    } else {
      res.end();
      return console.log("no param 'rows' found");
    }
  }
});

router.all ('/text/:rows', function (req, res, next) {
  console.log("IN DELETE");
  if (req.method !== "DELETE") {
    next();
  } else {
    if (req.params.rows) {
      var rows = req.params.rows;
      fs.readFile(textfilename, 'utf-8', function(err, data) {
        if (err){
          return console.log(err);
        }
        var lines = data.trim().split('\n');
        lines.splice(-1, rows);

        fs.writeFile(textfilename, lines.join("\n") + "\n", function(err) {
          if (err) {
            return console.log(err);
          } else {
            logFileSize();
          }
        })
      });
    } else {
      return console.log("no param 'rows' found");
    }
    res.end();
  }
});

function logFileSize() {
  var stats = fs.statSync(textfilename);
  var fileSizeInBytes = stats["size"];
  //Convert the file size to megabytes (optional)
  var fileSizeInKilobytes = fileSizeInBytes / 1024.0
  filesizelog.info("logsize:" + fileSizeInKilobytes.toString());
}

module.exports = router;
