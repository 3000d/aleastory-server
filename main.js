/**
 * Required to transpile ES2015 syntax with Babel.
 * We could use Node 5.3.0, but we're stuck with
 * 0.10.40 on Raspian :(
 */

require ('app-module-path').addPath(__dirname);
global.__base = __dirname + '/';

require('babel-core/register');
require('./app.js');
