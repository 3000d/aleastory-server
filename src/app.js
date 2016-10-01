'use strict';

require ('app-module-path').addPath(__dirname);
global.__base = __dirname + '/';

var logger = require('winston');
var SerialPort = require('serialport').SerialPort;
var sqlite3 = require('sqlite3').verbose();

var config = require('config/config');
var HttpServer = require('web/http-server');
var Communication = require('communication/Communication');
var Manager = require('hardware/Manager');
const Database = require('model/Database');

class App {
  static start() {
    this.serialPort = new SerialPort(config.PRINTER_SERIAL_PORT, {
      baudrate: config.PRINTER_SERIAL_BAUDRATE
    });

    this.serialPort.on('open', function() {
      console.log('Serial port opened');

      App._initPrinterManager();
    });

    this.serialPort.on('error', function() {
      if(config.isDebug()) {
        config.DRY_RUN = true;
        logger.warn('CAN\'T OPEN SERIAL PORT : RUNNING IN DRY RUN');
      } else {
        logger.error('FATAL: Can\'t open serial port in production. Run `npm run dev` to use dry mode.');
        process.exit();
      }

      App._initPrinterManager();
    });

  }

  static _initPrinterManager() {
    var printerManager = new Manager(this.serialPort);


    // socket communication (used for debug)
    let communication = new Communication();

    printerManager.on('started', function(devices) {
      let sqliteDb = App._initDatabase();
      let db = new Database(sqliteDb);

      communication.run(devices, db);
    });

    printerManager.start();
  }

  static _initDatabase() {
    let db = new sqlite3.Database('aleastory.db');

    db.serialize(function() {
      db.run("CREATE TABLE if not exists data (location TEXT)");
    });

    //db.close();

    return db;
  }
}

App.start();