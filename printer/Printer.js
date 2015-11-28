'use strict';

var EventEmitter = require('events').EventEmitter;
var SerialPort = require('serialport').SerialPort;
var ThermalPrinter = require('thermalprinter');
var logger = require('winston');

var config = require('config/config');

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
    logger.info('printing text : ', data);
    if(this.isReady) {
      this.emit('printStarted');

      if(data.text) {
        if(data.title) {
          this.printer
            .center().bold(true)
            .printLine(data.title)
            .bold(false)
            .printLine('-------------------');
        }

        this.printer
          .left()
          .addBlankLines(2)
          .small(true)
          .printLine(data.text)
          .addBlankLines(6)
          .print(function() {
            logger.info('Printing done.');
            this.emit('printDone');
          });
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
    }
    return this.printer;
  }
}

module.exports = Printer;