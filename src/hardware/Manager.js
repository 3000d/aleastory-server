'use strict';

var EventEmitter = require('events').EventEmitter;
var logger = require('winston');

var config = require('config/config');
var Button = require('hardware/Button');
var Led = require('hardware/Led');
var Printer = require('hardware/Printer');
var ImageFetcher = require('image/ImageFetcher');

class Manager extends EventEmitter {
  constructor(serialPort) {
    super();

    this.serialPort = serialPort;
    this.imageFetcher = new ImageFetcher(`${__base}../data/images`);
  }

  start() {
    this.button = new Button();
    this.greenLed = new Led(config.LED_GREEN_PIN, "green");
    this.redLed = new Led(config.LED_RED_PIN, "red");
    this.printer = new Printer(this.serialPort);

    var devices = {
      button: this.button,
      greenLed: this.greenLed,
      redLed: this.redLed,
      printer: this.printer
    };

    this.emit('started', devices);

    this.redLed.turnOn();

    this.printer.on('ready', function() {
      this.button.on('disabled', this.handleButtonDisabled.bind(this));
      this.button.on('enabled', this.handleButtonEnabled.bind(this));
      this.button.on('push', this.handleButtonPush.bind(this));

      this.button.start();

      this.emit('ready', devices);
    }.bind(this));


    this.printer.start();
  }

  handleButtonPush() {
    this.printer.printGooglePoetry();
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