'use strict';

var EventEmitter = require('events').EventEmitter;
var logger = require('winston');

var config = require('config/config');

class Led extends EventEmitter {
  constructor(pin, name) {
    super();

    this.pin = pin;
    this.state = false;
    this.name = name;
  }

  start() {
    if(!config.DRY_RUN) {
      var Gpio = require('onoff').Gpio; // required here or throws an error when not on raspi
      this.led = new Gpio(this.pin, 'out');
    }
  }

  turnOn() {
    if(this.led || config.DRY_RUN) {
      if(this.led) {
        this.led.writeSync(1);
      }
      this.state = true;
      this.emit('stateChanged', {
        name: this.name,
        state: true
      });
    }
  }

  turnOff() {
    if(this.led || config.DRY_RUN) {
      if(this.led) {
        this.led.writeSync(0);
      }
      this.state = false;
      this.emit('stateChanged', {
        name: this.name,
        state: false
      });
    }
  }
}

module.exports = Led;