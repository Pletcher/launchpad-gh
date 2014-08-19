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

describe('CreatePage', function() {
  var createPage = require('../../lib/github/create_page');

  describe('getReference()', function() {
    before(function(done) {
      Sinon.stub(Fs, 'readFileSync', function(file, encoding) {
        return 'flubwub';
      });

      Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
        return callback(null);
      });

      Sinon.stub(Nipple, 'read', function(response, options, callback) {
        return callback(null, { object: { sha: 'rk' } });
      });

      done();
    });

    after(function(done) {
      Fs.readFileSync.restore();
      Nipple.request.restore();
      Nipple.read.restore();

      done();
    });

    it('gets the sha of the reference', function(done) {
      createPage({ description: 'everything is awesome', pageUri: 'refs' }, 'token', function(err, body) {
        expect(err).not.to.exist;
        expect(body).to.exist;

        done();
      });
    });
  });

  describe('createBranch()', function() {
    before(function(done) {
      var calls = 0;

      Sinon.stub(Fs, 'readFileSync', function(file, encoding) {
        return 'flubwub';
      });

      Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
        return callback(null);
      });

      Sinon.stub(Nipple, 'read', function(response, options, callback) {
        if (calls === 0) {
          calls++;
          return callback(null, {});
        }

        return callback(new Error('createPage() error'));
      });

      done();
    });

    after(function(done) {
      Fs.readFileSync.restore();
      Nipple.request.restore();
      Nipple.read.restore();

      done();
    });

    it('handles errors', function(done) {
      createPage({ description: 'everything is awesome', refUri: 'foo', branchUri: 'bar', pageUri: 'baz' }, 'token', function(err, body) {
        expect(err).to.exist;

        done();
      });
    });
  });

  describe('createPage()', function() {
    before(function(done) {
      var calls = 0;

      Sinon.stub(Fs, 'readFileSync', function(file, encoding) {
        return 'flubwub';
      });

      Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
        return callback(null);
      });

      Sinon.stub(Nipple, 'read', function(response, options, callback) {
        if (calls < 2) {
          calls++;
          return callback(null, {});
        }

        return callback(new Error('createPage() error'));
      });

      done();
    });

    after(function(done) {
      Fs.readFileSync.restore();
      Nipple.request.restore();
      Nipple.read.restore();

      done();
    });

    it('handles errors', function(done) {
      createPage({ description: 'everything is awesome', refUri: 'foo', branchUri: 'bar', pageUri: 'baz' }, 'token', function(err, body) {
        expect(err).to.exist;

        done();
      });
    });
  });
});
