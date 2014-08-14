var githubRequest = require('./request');

module.exports = function createRepository(payload, token, callback) {
  var uri = payload.uri;

  delete payload.uri;

  payload = JSON.stringify(payload);

  var options = {
    headers: {
      Authorization: 'token ' + token,
      'User-Agent': 'Launchpad'
    },
    payload: payload
  };

  githubRequest('POST', uri, options, callback);
};
