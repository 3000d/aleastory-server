'use strict';
var SocketIO = require('socket.io');
var logger = require('winston');

class Communication {
  run(httpServer, devices) {
    var io = SocketIO.listen(httpServer);
    logger.info('socket.io is running');

    var self = this;

    io.sockets.on('connection', function(socket) {
      logger.info('A client is connected');

      socket.on('send-text', function(data) {
        devices.printer.printText(data);
      });

      socket.on('print-img', function() {
        devices.printer.printImage(__base + 'data/images/costanza.png');
      });

      socket.on('button-push', function() {
        devices.button.push();
      });

      socket.on('disconnect', function() {
        logger.info('client disconnected');

        devices.greenLed.removeListener('stateChanged', self.handleLedStateChange.bind(socket));
        devices.redLed.removeListener('stateChanged', self.handleLedStateChange.bind(socket));
      }.bind(this));


      // LEDs
      socket.emit('led-state-changed', {
        led: 'green',
        state: devices.greenLed.state
      });
      socket.emit('led-state-changed', {
        led: 'red',
        state: devices.redLed.state
      });

      devices.greenLed.on('stateChanged', self.handleLedStateChange.bind(socket));
      devices.redLed.on('stateChanged', self.handleLedStateChange.bind(socket));
    });
  }

  handleLedStateChange(led) {
    console.log('led state changed');
    this.emit('led-state-changed', {
      led: led.name,
      state: led.state
    });
  }
}

module.exports = Communication;