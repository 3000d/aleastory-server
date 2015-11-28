'use strict';

var EventEmitter = require('events').EventEmitter;
var logger = require('winston');

var config = require('config/config');
var Button = require('printer/Button');
var Led = require('printer/Led');
var Printer = require('printer/Printer');

class Manager extends EventEmitter {
  constructor() {
    super();
  }

  start() {
    this.button = new Button();
    this.greenLed = new Led(config.LED_GREEN_PIN, "green");
    this.redLed = new Led(config.LED_RED_PIN, "red");
    this.printer = new Printer();

    this.emit('started', {
      button: this.button,
      greenLed: this.greenLed,
      redLed: this.redLed,
      printer: this.printer
    });

    this.redLed.turnOn();

    this.printer.on('ready', function() {
      this.button.on('disabled', this.handleButtonDisabled.bind(this));
      this.button.on('enabled', this.handleButtonEnabled.bind(this));
      this.button.on('push', this.handleButtonPush.bind(this));

      this.button.start();

      this.emit('ready');
    }.bind(this));


    this.printer.start();
  }

  handleButtonPush() {
    if(Math.random() > 0.5) {
      this.printer.printText('hello world');
    } else {
      this.printer.printImage(__base + 'data/images/costanza.png');
    }
  }

  handleButtonDisabled() {
    this.greenLed.turnOff();
    this.redLed.turnOn();
  }

  handleButtonEnabled() {
    this.greenLed.turnOn();
    this.redLed.turnOff();
  }
}

module.exports = Manager;