var Hapi = require('hapi');
var Lab = require('lab');
var Nipple = require('nipple');
var Sinon = require('sinon');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = Lab.expect;

describe('github/dns', function() {
  var Dns = require('../../lib/github/dns');
  var spy, fakePlugin;

  beforeEach(function(done) {
    spy = Sinon.spy(function(slug, content, callback) {
      if (slug === 'error') {
        callback(new Error('dns error'));
      }

      callback(null, 'foo');
    });

    fakePlugin = {
      methods: {
        dns: spy
      }
    };

    done();
  });

  afterEach(function(done) {
    spy = null;
    fakePlugin = null;

    done();
  });

  it('calls the dns method', function(done) {
    var dns = Dns(fakePlugin, 'foo', 'bar');

    expect(spy.calledOnce).to.be.true;

    done();
  });

  it('handles errors', function(done) {
    Dns(fakePlugin, 'error', 'bar');

    expect(spy.calledOnce).to.be.true;

    done();
  });
});
