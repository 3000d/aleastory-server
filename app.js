'use strict';
require ('app-module-path').addPath(__dirname);
global.__base = __dirname + '/';

var logger = require('winston');

var config = require('config/config');
var HttpServer = require('web/http-server');
var Communication = require('web/communication');
var Manager = require('hardware/Manager');

class App {
  static run() {
    var printerManager = new Manager();

    if(config.DRY_RUN) {
      logger.warn('RUNNING IN DRY RUN : SERIAL AND GPIO NOT USED');
    }

    if(config.isDebug()) {
      App.initWebInterface(printerManager);
    }

    printerManager.start();
  }

  static initWebInterface(printerManager) {
    logger.warn('RUNNING IN DEBUG MODE');

    let httpServer = new HttpServer(config.HTTP_PORT);
    let communication = new Communication();

    httpServer.on('ready', function(server) {
      printerManager.on('started', function(devices) {
        communication.run(server, devices);
      });
    });

    httpServer.run();
  }
}

App.run();