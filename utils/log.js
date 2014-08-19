var bunyan = require('bunyan');
var log = bunyan.createLogger({ name: 'Launchpad GitHub'});

module.exports = process.env.TEST ? noopify(log) : log;

function noopify(obj) {
  var noop = function() {};

  for (var prop in obj) {
    obj[prop] = noop;
  }

  return obj;
}
