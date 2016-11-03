'use strict';

require ('app-module-path').addPath(__dirname + '/../src/');
global.__base = __dirname + '/../src/';

var GooglePoetry = require('../src/text/googlePoetry/GooglePoetry');

for(var i = 0; i < 10; i++) {
  new GooglePoetry(null, (payload) => {
    console.log(payload.query, payload.results);
  })
}