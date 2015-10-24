var http = require('http');
var fs = require('fs');
var SocketIO = require('socket.io');
var SerialPort = require('serialport').SerialPort,
  serialPort = new SerialPort('/dev/ttyAMA0', {
    baudrate: 19200
  });
var Printer = require('thermalprinter');

var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(err, content) {
    res.writeHead(200, {"Content-type": "text/html"});
    res.end(content);
  });
});

var io = SocketIO.listen(server);

serialPort.on('open', function() {
  var printer = new Printer(serialPort);

  printer.on('ready', function() {
    io.sockets.on('connection', function(socket) {
      socket.on('send-text', function(text) {
        printer
          .indent(10)
          .printLine(text);
      });
    });
  });
});

server.listen(8080);