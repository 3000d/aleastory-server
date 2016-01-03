'use strict';
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

var logger = require('winston');
var http = require('http');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var serve = serveStatic('./');

class HttpServer extends EventEmitter {
  constructor(port) {
    super();
    this.port = port;
  }

  run() {
    this.server = http.createServer(function(req, res) {
      fs.readFile('./index.html', 'utf-8', function(err, content) {
        var done = finalhandler(req, res);
        serve(req, res, done);
      });
    });
    this.server.listen(this.port);

    logger.info(`HTTP Server is running on localhost:${this.port}`);
    this.emit('ready', this.server);
  }

  getServer() {
    return this.server;
  }
}

module.exports = HttpServer;