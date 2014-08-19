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

describe('index', function() {
  before(function(done) {
    Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
      return callback(null);
    });

    Sinon.stub(Nipple, 'read', function(response, options, callback) {
      return callback(null, { object: {} });
    });

    done();
  });

  after(function(done) {
    Nipple.request.restore();
    Nipple.read.restore();

    done();
  });

  var server = new Hapi.Server();

  var baseOptions = {
    method: 'POST',
    url: '/github'
  };

  server.pack.register({
    plugin: require('../'),
    options: {
      token: 'zanzibar',
      uri: 'api.github.com'
    }
  }, function(err) {
    expect(err).to.equal(undefined);
  });

  it('accepts a name parameter between 2 and 200 characters', function(done) {
    var options = Object.create(baseOptions);

    options.payload = {
      name: 'Ren',
      slug: 'ren-asm',
      description: 'Stimpy'
    };

    server.inject(options, function(response) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('rejects a name parameter shorter than 2 characters', function(done) {
    var options = Object.create(baseOptions);

    options.payload = {
      name: 'R',
      slug: 'r',
      description: 'Stimpy'
    };

    server.inject(options, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('rejects a name parameter longer than 200 characters', function(done) {
    var options = Object.create(baseOptions);

    options.payload = {
      name: 'RenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRenRen',
      description: 'Stimpy',
      slug: 'rerereren'
    };

    server.inject(options, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('rejects a description parameter shorter than 2 characters', function(done) {
    var options = Object.create(baseOptions);

    options.payload = {
      name: 'Ren',
      description: 'S',
      slug: 'ren'
    };

    server.inject(options, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
