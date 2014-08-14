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

describe('github/create_repository', function() {
  var createRepository = require('../../lib/github/create_repository');

  describe('nippleRequest()', function() {
    before(function(done) {
      Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
        callback(new Error('Nipple.request() error'));
      });

      done();
    });

    after(function(done) {
      Nipple.request.restore();

      done();
    });

    it('returns if it encounters an error when requesting', function(done) {
      createRepository({}, 'token', function(err, body) {
        expect(err).to.exist;
        expect(err.message).to.equal('Nipple.request() error');

        done();
      });
    });
  });

  describe('nippleRead()', function() {
    before(function(done) {
      Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
        callback(null, {});
      });

      Sinon.stub(Nipple, 'read', function(response, options, callback) {
        callback(new Error('Nipple.read() error'));
      });

      done();
    });

    after(function(done) {
      Nipple.request.restore();
      Nipple.read.restore();
      done();
    });

    it('returns if it encounters an error when reading', function(done) {
      createRepository({}, 'token', function(err, body) {
        expect(err).to.exist;
        expect(err.message).to.equal('Nipple.read() error');

        done();
      });
    });
  });
});
