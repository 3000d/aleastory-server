'use strict';

require ('app-module-path').addPath(__dirname);
global.__base = __dirname + '/';

var logger = require('winston');

var config = require('config/config');
var HttpServer = require('web/http-server');
var Communication = require('communication/Communication');
var Manager = require('hardware/Manager');

class App {
  static run() {
    var printerManager = new Manager();

    if(config.DRY_RUN) {
      logger.warn('RUNNING IN DRY RUN : SERIAL AND GPIO NOT USED');
    }

    // socket communication (used for debug)
    let communication = new Communication();

    printerManager.on('started', function(devices) {
      communication.run(devices);
    });

    printerManager.start();
  }
}

App.run();