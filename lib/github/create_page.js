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
  createIndex(payload, options, function(err, response) {
    if (err) {
      return callback(err);
    }

    createStyle(payload, options, callback);
  });
}

function createIndex(payload, options, callback) {
  var pageUri = payload.pageUri;
  var name = payload.name;
  var slug = payload.slug;

  delete payload.pageUri;
  delete payload.name;
  delete payload.slug;

  var indexPath = path.resolve(__dirname, '../..', 'template/index.html');
  var index = fs.readFileSync(indexPath, { encoding: 'utf8' });

  index = index.replace(/PRODUCT_NAME/g, name);
  index = index.replace(/PRODUCT_SLUG/g, slug);
  index = new Buffer(index);

  payload.content = index.toString('base64');

  options.payload = JSON.stringify(payload);

  githubRequest('PUT', pageUri, options, callback);
}

function createStyle(payload, options, callback) {
  var styleUri = payload.styleUri;
  var cssPath = path.resolve(__dirname, '../..', 'template/style.css');
  var css = fs.readFileSync(cssPath);

  payload.content = css.toString('base64');
  options.payload = JSON.stringify(payload);

  githubRequest('PUT', styleUri, options, callback);
}
