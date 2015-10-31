var fs = require('fs');
var SocketIO = require('socket.io');
var SerialPort = require('serialport').SerialPort;
var port = '/dev/ttyAMA0';

var http = require('http');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var serve = serveStatic('./');

var Printer = require('thermalprinter');
var printer;
var isPrinterReady = false;


/**
 * DATABASE
 */

var mongoose = require('mongoose');
var random = require('mongoose-random');
var mongoURI = 'mongodb://localhost:27017/aleastory';
var db = mongoose.connect(mongoURI).connection;
db.on('error', function(err) { console.log(err.message); });

var cookieSchema = mongoose.Schema({
  text: String
});
cookieSchema.plugin(random);
var Cookie = mongoose.model('Cookie', cookieSchema);

db.once('open', function() {
  Cookie.remove({});

  Cookie.find(function(err, cookies) {
    if(!cookies.length) {
      var quotes = require('./quotes');

      for(var i = 0; i < quotes.length; i++) {
        var quote = quotes[i];
        var cookie = new Cookie({
          text: quote
        });
        cookie.save(function(err, cookies) {
          if(err) {
            console.log('error, cookie "' + quote + '" not saved');
          }
        })
      }

      console.log('cookies inserted');
    }


    Cookie.syncRandom(function(){});

    Cookie.count().exec(function(err, count) {
      console.log(count + ' cookies');
    });
  });
});



// get serial port, or default to /dev/ttyAMA0
process.argv.forEach(function (val, index, array) {
  if(index == 2) {
    if(val) {
      port = val;
    }
  }
});



/**
 * HTTP
 */

var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(err, content) {
    var done = finalhandler(req, res);
    serve(req, res, done);
  });
});
server.listen(8081);



/**
 * IO
 */

var io = SocketIO.listen(server);

io.sockets.on('connection', function(socket) {
  console.log('client connected');
  socket.on('send-text', function(text) {

  });

  socket.on('print', function() {
    triggerPrint();
  });
});



/**
 * SERIAL
 */

var serialPort = new SerialPort(port, {
  baudrate: 19200
});

serialPort.on('open', function() {
  console.log('serial port opened');
  printer = new Printer(serialPort);

  printer.on('ready', function() {
    console.log('printer ready');
    isPrinterReady = true;


    /**
     * BUTTON
     */

    var Gpio = require('onoff').Gpio;
    var button = new Gpio(21, 'in', 'both');

    button.watch(function(err, value) {
      if(err) exit();
      if(value) {
        triggerPrint();
      }
    });
  });
});

serialPort.on('error', function() {
  console.log('Can\'t open serial port, no printing for you.');
});





/**
 * PRINT
 */

var triggerPrint = function() {
  Cookie.find().limit(1).exec(function(err, cookie) {
    console.log(cookie);
  });

  Cookie.findRandom().limit(1).exec(function(err, cookies) {
    if(!cookies) {
      console.log('no cookie found :(');
      return;
    }

    console.log('cookie is "' + cookies[0].text + '"');

    if(isPrinterReady) {
      console.log('printing', text);
      printer
        .printLine(cookies[0].text)
        .printLine('')
        .printLine('')
        .printLine('')
        .print(function() {
          console.log('done');
        });
    }
  });
};

