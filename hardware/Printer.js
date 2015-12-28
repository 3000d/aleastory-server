'use strict';

var EventEmitter = require('events').EventEmitter;
var SerialPort = require('serialport').SerialPort;
var ThermalPrinter = require('thermalprinter');
var logger = require('winston');
var markdown = require('markdown').markdown;

var config = require('config/config');
var Parser = require('text/Parser');

class Printer extends EventEmitter {
  constructor() {
    super();

    this.isReady = false;
  }

  start() {
    if(!config.DRY_RUN) {
      this.serialPort = new SerialPort(config.PRINTER_SERIAL_PORT, {
        baudrate: config.PRINTER_SERIAL_BAUDRATE
      });

      this.serialPort.on('open', function() {
        console.log('Serial port opened');
        this.printer = new ThermalPrinter(this.serialPort);
        this.parser = new Parser(this.printer);

        this.printer.on('ready', function() {
          console.log('Printer is ready.');
          this.emit('ready');
          this.isReady = true;
        }.bind(this));
      });

      this.serialPort.on('error', function() {
        console.log('Can\'t open serial port, no printing for you.');
      });
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
          //this.printer = this.parser.parse(data.text);
          this.printer.printLine(data.text);

          this.printer.print(function () {
            logger.info('Printing done.');
            this.emit('printDone');
          });
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

      this.printer.printLine('')
        .addBlankLines(2)
        .printImage(imagePath)
        .addBlankLines(2)
        .print(function() {
          logger.info('Printing done.');
          this.emit('printDone');
        });
    }
  }

  addBlankLines(lineCount) {
    for(let i = 0; i < lineCount; i++) {
      this.printer.printLine('');
      this.printer.writeCommand();
    }
    return this.printer;
  }
}

module.exports = Printer;