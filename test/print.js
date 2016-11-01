'use strict';
var path = require('path');
require ('app-module-path').addPath(path.join(__dirname + '/..'));

var SerialPort = require('serialport').SerialPort;
var Printer = require('thermalprinter');

var config = require('src/config/config');

var serialPort = new SerialPort(config.PRINTER_SERIAL_PORT, {
  baudrate: config.PRINTER_SERIAL_BAUDRATE
});

var printLeftAndRight = function(printer, leftText, rightText) {
  var lineChars = 32;
  var leftChars = leftText.length;
  var rightChars = rightText.length;
  var spacesCount = lineChars - rightChars - leftChars;
  var spaces = Array(spacesCount + 1).join(' ');

  if(leftChars + rightChars > lineChars) {
    throw new Error('You\'re trying to print left and right with too much characters (max '+ lineChars + ')');
  }

  return printer.printLine(leftText + spaces + rightText);
};

serialPort.on('open', function() {
  var printer = new Printer(serialPort);

  printer.on('ready', function() {
    //printer.big(true);
    //printer.writeCommands([27, 14, 1]);
    printer = printLeftAndRight(printer, 'SUPER :)', 'Right on sucker !');
    printer
      .printLine()
      .printLine()
      .printLine()
      .printLine()
      .printLine()
      .print(function() {
        process.exit(1);
      });


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



