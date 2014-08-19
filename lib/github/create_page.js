var githubRequest = require('./request');
var fs = require('fs');
var path = require('path');

module.exports = function CreatePage(payload, token, callback) {
  var refUri = payload.refUri;
  var branchUri = payload.branchUri;

  delete payload.refUri;
  delete payload.branchUri;

  var options = {
    headers: {
      Authorization: 'token ' + token,
      'Content-Type': 'application/json',
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
  var pageUri = payload.pageUri;
  var name = payload.name;
  var slug = payload.slug;

  delete payload.pageUri;
  delete payload.name;
  delete payload.slug;

  var indexPath = path.resolve(__dirname, '../..', 'template/index.html');
  var cssPath = path.resolve(__dirname, '../..', 'template/style.css');
  var index = fs.readFileSync(indexPath, { encoding: 'utf8' });
  var css = fs.readFileSync(cssPath);

  index = index.replace(/PRODUCT_NAME/g, name);
  index = index.replace(/PRODUCT_SLUG/g, slug);
  index = new Buffer(index);

  payload.content = index.toString('base64');

  options.payload = JSON.stringify(payload);

  githubRequest('PUT', pageUri, options, function(err, response) {
    if (err) {
      return callback(err);
    }

    pageUri = pageUri.replace('index.html', 'style.css');

    var newPayload = JSON.parse(options.payload);

    newPayload.content = css.toString('base64');

    options.payload = JSON.stringify(newPayload);

    githubRequest('PUT', pageUri, options, callback);
  });
}
