'use strict';

var HttpServer = require('./http-server');
var config = require('../config/config');

var httpServer = new HttpServer(config.HTTP_PORT);

httpServer.run();