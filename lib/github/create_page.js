var githubRequest = require('./request');
var fs = require('fs');
var path = require('path');

module.exports = function(payload, token, callback) {
  var refUri = payload.refUri;
  var branchUri = payload.branchUri;

  delete payload.refUri;
  delete payload.branchUri;

  var options = {
    headers: {
      Authorization: 'token ' + token,
      'User-Agent': 'Launchpad'
    }
  };

  getReference(refUri, options, function(err, body) {
    if (err) {
      return callback(err);
    }

    var sha1 = body.object && body.object.sha;
    var createBranchPayload = JSON.stringify({
      ref: 'refs/heads/gh-pages',
      sha: sha1
    });

    options.payload = createBranchPayload;

    createBranch(branchUri, options, function(err, body) {
      if (err) {
        return callback(err);
      }

      createPage(payload, options, callback);
    });
  });
};

function getReference(uri, options, callback) {
  githubRequest('GET', uri, options, callback);
}

function createBranch(uri, options, callback) {
  githubRequest('POST', uri, options, callback);
}

function createPage(payload, options, callback) {
  var uri = payload.pageUri;
  var name = payload.name;
  var slug = payload.slug;
  var description = payload.description.replace('\n', '<br>', 'g');

  delete payload.uri;
  delete payload.name;
  delete payload.slug;
  delete payload.description;

  var indexPath = path.resolve(__dirname, '../..', 'template/index.html');
  var cssPath = path.resolve(__dirname, '../..', 'template/main.css');
  var index = fs.readFileSync(indexPath, { encoding: 'utf8' });

  index = index.replace(/PRODUCT_NAME/g, name);
  index = index.replace(/PRODUCT_SLUG/g, slug);
  index = index.replace(/DESCRIPTION/g, description);
  index = new Buffer(index);

  payload.content = index.toString('base64');

  payload = JSON.stringify(payload);

  options.payload = payload;

  githubRequest('PUT', uri, options, callback);
}
