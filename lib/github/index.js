var internals = {};

module.exports = function GitHub(options) {
  internals.organization = options.organization;
  internals.token = options.token;
  internals.uri = options.uri;

  return function GitHubHandler(request, reply) {
    var name = request.payload.name;
    var description = request.payload.description;
    var payload = {
      uri: internals.uri + '/orgs/' + internals.organization + '/repos',
      name: name,
      description: description,
      auto_init: true
    };

    require('./create_repository')(payload, internals.token, createRepository(request, reply));
  };
};

function createRepository(request, reply) {
  return function handleRepository(err, body) {
    if (err) {
      return reply(err);
    }

    var uri = internals.uri + '/repos/' + body.full_name;

    var payload = {
      branchUri: uri + '/git/refs',
      pageUri: uri + '/contents/index.html',
      refUri: uri + '/git/refs/heads/master',
      name: request.payload.name,
      slug: request.payload.slug,
      description: request.payload.description,
      path: '/',
      message: 'Initial commit',
      branch: 'gh-pages'
    };

    require('./create_page')(payload, internals.token, createPage(request, reply));
  };
}

function createPage(request, reply) {
  return function handlePage(err, body) {
    if (err) {
      return reply(err);
    }

    reply(body);
  };
}
