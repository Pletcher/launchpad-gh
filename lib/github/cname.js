var githubRequest = require('./request');

module.exports = function CName(payload, token, callback) {
  var uri = payload.uri;

  delete payload.uri;

  var options = {
    headers: {
      Authorization: 'token ' + token,
      'Content-Type': 'application/json',
      'User-Agent': 'Launchpad'
    },
    payload: JSON.stringify(payload)
  };

  githubRequest('PUT', uri, options, callback);
};
