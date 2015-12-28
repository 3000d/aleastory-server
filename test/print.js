'use strict';
var path = require('path');
console.log(path.join(__dirname + '/..'));
require ('app-module-path').addPath(path.join(__dirname + '/..'));

var SerialPort = require('serialport').SerialPort;
var Printer = require('thermalprinter');

var config = require('config/config');

var serialPort = new SerialPort(config.PRINTER_SERIAL_PORT, {
  baudrate: config.PRINTER_SERIAL_BAUDRATE
});

serialPort.on('open', function() {
  var printer = new Printer(serialPort);

  printer.on('ready', function() {
    //printer.big(true);
    //printer.writeCommands([27, 14, 1]);
    printer.printText('Hello ')
      .bold(true)
      .printText('World')
      .bold(false)
      .printText(' etsa !')
      .printLine()
      .printLine()
      .printLine()
      .printLine()
      .printLine()
      .print();

    //printer.writeCommand(10);
    //printer.writeCommands([27, 14, 0]);
    //printer.big(false);
    //printer.writeCommand(10);
    //printer.writeCommand(10);
    //printer.writeCommand(10);
    //printer.writeCommand(10);
    //printer.print(function() {
    //  console.log('printing done');
    //});
  });
});

