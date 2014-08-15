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

describe('github/index', function() {
  var server = new Hapi.Server();
  var baseOptions = {
    method: 'POST',
    url: '/github'
  };

  server.pack.register({
    plugin: require('../../'),
    options: {
      token: 'zanzibar',
      uri: 'github.com',
      organization: 'fancy-coffee'
    }
  }, function(err) {
    expect(err).to.equal(undefined);
  });

  describe('createRepository()', function() {
    before(function(done) {
      Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
        return callback(null);
      });

      Sinon.stub(Nipple, 'read', function(response, options, callback) {
        return callback(new Error('this one looks bad'));
      });

      done();
    });

    after(function(done) {
      Nipple.request.restore();
      Nipple.read.restore();

      done();
    });

    it('handles errors', function(done) {
      var options = Object.create(baseOptions);

      options.payload = {
        name: 'Ren',
        slug: 'ren-asm',
        description: 'Stimpy'
      };

      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(500);
        done();
      });
    });
  });

  describe('createPage()', function() {
    before(function(done) {
      var calls = 0;

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
      Nipple.request.restore();
      Nipple.read.restore();

      done();
    });

    it('handles errors', function(done) {
      var options = Object.create(baseOptions);

      options.payload = {
        name: 'Ren',
        slug: 'ren-asm',
        description: 'Stimpy'
      };

      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(500);
        done();
      });
    });
  });
});
