'use strict';

var EventEmitter = require('events').EventEmitter;
var SerialPort = require('serialport').SerialPort;
var ThermalPrinter = require('thermalprinter');
var logger = require('winston');
var markdown = require('markdown').markdown;

var getRandom = require('util/Util').getRandom;
var config = require('config/config');
var Parser = require('text/Parser');
var GooglePoetry = require('text/GooglePoetry');

class Printer extends EventEmitter {
  constructor(serialPort) {
    super();

    this.isReady = false;
    this.serialPort = serialPort;
  }

  start() {
    if(!config.DRY_RUN) {
      this.printer = new ThermalPrinter(this.serialPort);
      this.parser = new Parser(this.printer);

      this.printer.on('ready', function() {
        console.log('Printer is ready.');
        this.emit('ready');
        this.isReady = true;
      }.bind(this));
    } else {
      this.emit('ready');
    }
  }

  printText(data) {
    if(data.text) {
      logger.info(`printing text : \n\n${data.text}\n\n`);

      if(!config.DRY_RUN) {
        if(this.isReady) {
          this.emit('printStarted');
          this.parser.parse(data.text);
          //this.printer.printLine(data.text);

          this.printer.print(function () {
            logger.info('Printing done.');
            this.emit('printDone');
          }.bind(this));
        }
      } else {
        this.emit('printStarted');
        var htmlText = markdown.toHTML(data.text);
        this.emit('printDone', htmlText);
      }
    }
  }

  printImage(imagePath) {
    logger.info('printing image : ', imagePath);
    if(this.isReady) {
      this.emit('printStarted');

      this.printer.printLine()
        .printLine()
        .printLine()
        .printImage(imagePath)
        .printLine()
        .printLine()
        .print(function() {
          logger.info('Printing done.');
          this.emit('printDone');
        }.bind(this));
    }
  }

  printGooglePoetry(query) {
    new GooglePoetry(query, (results) => {
      logger.info('printing Google Poetry ', query);
      results = getRandom(results, 4);

      if(this.isReady) {
        this.emit('printStarted');

        // Title
        this.printer.center().bold(true);
        this.printText(query);
        this.printer
          .printLine()
          .bold(false)
          .printLine('----------------')
          .left()
          .printLine();

        // Results
        for(var i = 0; i < results.length; i++) {
          this.printer.printText(results[i]);
        }

        this.printer
          .printLine().printLine().printLine()
          .printLine().printLine().printLine()
          .printLine().printLine().printLine();

        this.printer.print(function() {
          logger.info('Printing done.');
          this.emit('printDone');
        }.bind(this));
      }
    });
  }
}

module.exports = Printer;