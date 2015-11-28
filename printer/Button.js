'use strict';

var EventEmitter = require('events').EventEmitter;
var logger = require('winston');

var config = require('config/config');

class Button extends EventEmitter {
  constructor() {
    super();

    this.isButtonReady = true;
    this.emit('disabled');
  }

  start() {
    if(!config.DRY_RUN) {
      var Gpio = require('onoff').Gpio; // required here or throws an error when not on raspi
      this.button = new Gpio(config.BUTTON_PIN, 'in', 'both');
      this.emit('enabled');

      this.button.watch(function(err, value) {
        if(err) exit();

        if(value) {
          logger.info('Button pushed');
          this.push();
        }
      });
    } else {
      this.emit('enabled');
    }
  }

  push() {
    if(this.isButtonReady) {
      this.emit('push');
      this.coolOff();
    }
  }

  coolOff() {
    this.isButtonReady = false;
    logger.info('Button cools off for ' + config.BUTTON_COOL_OFF_DELAY + ' ms');
    this.emit('disabled');

    setTimeout(function() {
      this.isButtonReady = true;
      logger.info('Cool off is over, button is back to work');
      this.emit('enabled');
    }.bind(this), config.BUTTON_COOL_OFF_DELAY);
  }
}

module.exports = Button;