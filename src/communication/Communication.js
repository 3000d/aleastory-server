'use strict';
var SocketIO = require('socket.io');
var SocketIOFileUpload = require('socketio-file-upload');
var logger = require('winston');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var config = require('config/config');

class Communication {
  run(devices, db) {
    var io = SocketIO.listen(8081);
    logger.info('socket.io is running');

    var self = this;

    io.sockets.on('connection', function(socket) {
      logger.info('A client is connected');

      // proxy function for addEventListener and removeEventListener
      // (bind creates a new function reference)
      // http://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
      var handleStateChange = self.handleLedStateChange.bind(socket);

      socket.on('send-text', function(data) {
        devices.printer.printText(data);
      });

      socket.on('print-img', function() {
        devices.printer.printImage(__base + 'data/images/costanza.png');
      });

      socket.on('print-file', function(filename) {
        db.getLocation(function(location) {
          let ext = filename.split('.').pop();
          let fileLocation = location + '/' + filename;

          if(ext == 'md') {
            try {
              let content = fs.readFileSync(fileLocation, 'utf8');
              console.log(content);
              devices.printer.printText({text: content});
            } catch(e) {
              console.error('Could not print text from location ', fileLocation);
            }
          } else if(['jpg', 'jpeg', 'JPG'].indexOf(ext) > -1) {
            devices.printer.printImage(fileLocation);
          }
        });

      });

      socket.on('button-push', function() {
        devices.button.push();
      });

      socket.on('disconnect', function() {
        logger.info('client disconnected');

        devices.greenLed.removeListener('stateChanged', handleStateChange);
        devices.redLed.removeListener('stateChanged', handleStateChange);
        devices.printer.removeAllListeners();
      }.bind(this));

      socket.on('get-data-location', function () {
        db.getLocation((location) => {
          socket.emit('data-location', location);
        });
      });

      socket.on('get-file-list', function() {
        self.emitFileList(socket, db);
      });

      socket.on('set-data-location', function (location) {
        if(!location) {
          return;
        }

        console.log('changing data location to', location);
        db.setLocation(location, function() {
          // refresh file list
          self.emitFileList(socket, db);
        });
      });


      // LEDs
      socket.emit('led-state-changed', {
        led: 'green',
        state: devices.greenLed.state
      });
      socket.emit('led-state-changed', {
        led: 'red',
        state: devices.redLed.state
      });

      devices.greenLed.on('stateChanged', handleStateChange);
      devices.redLed.on('stateChanged', handleStateChange);
      devices.printer.on('printDone', self.handlePrintDone.bind(socket));


      // Image uploader
      var uploader = new SocketIOFileUpload();
      uploader.dir = `${__base}../data/images`;
      uploader.listen(socket);

      // Do something when a file is saved:
      uploader.on("saved", function(event){
        logger.info('file saved :', event.file.name);
      });

      // Error handler:
      uploader.on("error", function(event){
        logger.error("Error from uploader", event);
      });


    });
  }

  handleLedStateChange(led) {
    this.emit('led-state-changed', {
      led: led.name,
      state: led.state
    });
  }

  handlePrintDone(htmlText) {
    this.emit('printing-done', {
      htmlText
    });
  }

  emitFileList(socket, db) {
    db.getLocation((location) => {
      try {
        let extensions = ['jpg', 'jpeg', 'png', 'gif', 'JPG', 'md'];
        let fileList = fs.readdirSync(location).filter((filename) => {
          let ext = filename.split('.').pop();
          if(extensions.indexOf(ext) > -1) {
            return filename;
          }
        });
        socket.emit('file-list', fileList);
      } catch(e) {
        console.error('could not read folder at location', location, e);
      }
    });
  }
}

module.exports = Communication;