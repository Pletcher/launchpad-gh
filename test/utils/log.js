var Fs = require('fs');
var Hapi = require('hapi');
var Lab = require('lab');
var Nipple = require('nipple');
var Sinon = require('sinon');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

describe('utils/log', function() {
  // there isn't really a good way to test this without
  // mucking up the environment
  it('logs');
});
