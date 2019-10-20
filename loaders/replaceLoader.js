const loaderUtils = require('loader-utils');

module.exports = function (soruce) {
  const options = loaderUtils.getOptions(this);
  const result = soruce.replace('xh', 'world111');
  this.callback(null, result);
}