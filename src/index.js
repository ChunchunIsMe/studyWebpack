// ES6
import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));

// CommonJS
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));

// AMD
require(['./vendor/multi'], function (multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
});