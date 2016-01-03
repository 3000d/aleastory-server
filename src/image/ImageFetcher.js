'use strict';

var fs = require('fs');

var config = require('config/config');

class ImageFetcher {
  constructor(path) {
    this.path = path;
  }

  getRandomImage() {
    var _self = this;

    var items = fs.readdirSync(this.path);
    var filePath = items[Math.floor(Math.random() * items.length)];
    var extension = filePath.replace(/.*\./, '').toLowerCase();

    // file hasn't an accepted extension (see config)
    if(config.IMG_ACCEPTED_EXTENSIONS.indexOf(extension) < 0) {
      return _self.getRandomImage();
    } else {
      return filePath;
    }
  }
}

module.exports = ImageFetcher;