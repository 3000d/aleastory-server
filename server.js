var http = require('http');
var fs = require('fs');
var SocketIO = require('socket.io');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var Gpio = require('onoff').Gpio;
var SerialPort = require('serialport').SerialPort,
  serialPort = new SerialPort('/dev/ttyAMA0', {
    baudrate: 19200
  });
var Printer = require('thermalprinter');
var serve = serveStatic('./');
var button = new Gpio(21, 'in', 'both');

var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(err, content) {
    var done = finalhandler(req, res);
    serve(req, res, done);
  });
});

var io = SocketIO.listen(server);

serialPort.on('open', function() {
  console.log('serial port opened');
  var printer = new Printer(serialPort);

  printer.on('ready', function() {
    console.log('printer ready');
    io.sockets.on('connection', function(socket) {
      console.log('client connected');
      socket.on('send-text', function(text) {
        console.log('printing', text);
        printer
          .printLine(text)
          .print(function() {
            console.log('done');
          });
      });
    });
  });
});

button.watch(function(err, value) {
  if(err) exit();
  console.log('button pressed !', value);
});



server.listen(8080);