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

describe('CName', function() {
  var CName = require('../../lib/github/cname');

  var requestSpy, readSpy;

  before(function(done) {
    requestSpy = Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
      callback(null);
    });

    readSpy = Sinon.stub(Nipple, 'read', function(response, options, callback) {
      callback(null, {});
    });

    done();
  });

  after(function(done) {
    Nipple.request.restore();
    Nipple.read.restore();
    
    done();
  });

  it('makes a request to GitHub', function(done) {
    CName({ uri: 'foo' }, 'bar', function(err, payload) {
      expect(err).not.to.exist;
      expect(requestSpy.calledOnce).to.be.true;
      expect(readSpy.calledOnce).to.be.true;
      
      done();
    });
  });
});
