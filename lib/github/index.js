var CreateRepository = require('./create_repository');
var CreatePage = require('./create_page');
var CName = require('./cname');
var Dns = require('./dns');
var log = require('../../utils/log');

var internals = {};

module.exports = function GitHub(plugin, options) {
  internals.organization = options.organization;
  internals.token = options.token;
  internals.uri = options.uri;
  internals.domain = options.domain;
  internals.cname = !!plugin.methods.dns;

  return function GitHubHandler(request, reply) {
    var name = internals.slug = request.payload.slug;
    var description = request.payload.description;

    if (internals.cname) {
      Dns(plugin, name, internals.organization + '.github.io');
    }

    log.info(request.payload);

    var payload = {
      uri: internals.uri + '/orgs/' + internals.organization + '/repos',
      name: name,
      description: description,
      auto_init: true,
      homepage: request.payload.homepage,
      private: false,
      has_issues: false,
      has_wiki: false,
      has_downloads: false,
      license_template: 'agpl'
    };

    log.info(payload.uri);

    CreateRepository(payload, internals.token, createRepository(request, reply));
  };
};

function createRepository(request, reply) {
  return function handleRepository(err, body) {
    if (err) {
      return reply(err);
    }

    // assign fullName in internals; we might need it for CNAME-ing
    internals.fullName = body.full_name;

    var uri = internals.uri + '/repos/' + internals.fullName;

    log.info(uri);

    var payload = {
      branchUri: uri + '/git/refs',
      pageUri: uri + '/contents/index.html',
      styleUri: uri + '/contents/style.css',
      refUri: uri + '/git/refs/heads/master',
      name: request.payload.name,
      slug: request.payload.slug,
      description: request.payload.description,
      message: 'Initial commit',
      branch: 'gh-pages'
    };

    CreatePage(payload, internals.token, createPage(request, reply));
  };
}

function createPage(request, reply) {
  return function handlePage(err, body) {
    if (err) {
      return reply(err);
    }

    if (internals.cname) {
      var uri = internals.uri + '/repos/' + internals.fullName;
      var payload = {
        uri: uri + '/contents/CNAME',
        message: 'Add CNAME record',
        content: new Buffer(internals.slug + '.' + internals.domain).toString('base64'),
        branch: 'gh-pages'
      };

      return CName(payload, internals.token, addCName(request, reply));
    }

    reply(body);
  };
}

function addCName(request, reply) {
  return function handleCName(err, body) {
    if (err) {
      return reply(err);
    }

    log.info('Successfully added a CNAME file to the repo.');
    log.info(body);

    reply(body);
  };
}
