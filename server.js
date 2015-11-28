var fs = require('fs');
var SocketIO = require('socket.io');
var SerialPort = require('serialport').SerialPort;
var port = '/dev/ttyAMA0';

var http = require('http');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var serve = serveStatic('./');

//var Printer = require('./printer/Printer');
var Printer = require('thermalprinter');
var printer;
var printerOptions = {
  //maxPrintingDots: 15,
  //heatingTime: 150,
  //heatingInterval: 4,
  //commandDelay: 5
};
var isPrinterReady = false;
var isButtonReady = true;

var cookies = require('./quotes');
var images = require('./images');


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
  socket.on('send-text', function(data) {
    printText(data);
  });

  socket.on('print', function() {
    triggerPrint();
  });

  socket.on('print-img', function() {
    printImage();
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
  printer = new Printer(serialPort, printerOptions);

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
      if(value && isButtonReady) {
        triggerPrint();
        coolOff();
      }
    });
  });
});

serialPort.on('error', function() {
  console.log('Can\'t open serial port, no printing for you.');
});

var coolOff = function() {
  isButtonReady = false;
  setTimeout(function() {
    isButtonReady = true;
  }, 1000);
};




/**
 * PRINT
 */

var triggerPrint = function() {
  //Cookie.find().exec(function(err, cookies) {
  //  if(!cookies) {
  //    console.log('no cookie found :(');
  //    return;
  //  }
  //
  //  var cookie = cookies[Math.floor(Math.random() * cookies.length)];


  if(Math.random()<1) {
    printCookie();
  } else {
    printImage();
  }

  //});
};

var printText = function(data) {
  if(isPrinterReady) {
    if(data.text) {
      if(data.title) {
        printer
          .center().bold(true)
          .printLine(data.title)
          .bold(false)
          .printLine('-------------------');
      }

      printer
        .left()
        .printLine('')
        .printLine('')
        .small(true)
        .printLine(data.text)
        .printLine('')
        .printLine('')
        .printLine('')
        .printLine('')
        .printLine('')
        .printLine('')
        .print(function() {
          console.log('done');
        });
    }
  }
};

var printCookie = function() {
  var cookie = cookies[Math.floor(Math.random() * cookies.length)];

  console.log('printing', cookie);

  if(isPrinterReady) {
    printer
      .center().bold(true)
      .printLine('YOUR FORTUNE COOKIE')
      .bold(false)
      .printLine('-------------------')
      .printLine('')
      .printLine('')
      .left()
      .printLine(cookie)
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .print(function() {
        console.log('done');
      });
  }
};

var printImage = function() {
  //var image = images[Math.floor(Math.random() * images.length)];
  var image = __dirname + '/uploads/kroll_renseignements_rotated.png';
  console.log('printing image ', image);
  if(isPrinterReady) {
    printer.printLine('')
      .printLine('')
      .printLine('')
      .printImage(image)
      .printLine('')
      .printLine('')
      .print(function() {
        console.log('done');
      });
  }
};

var formatTextForPrinter = function(text) {

};