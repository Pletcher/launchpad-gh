var Nipple = require('nipple');

module.exports = function GitHubRequest(method, uri, options, callback) {
  Nipple.request(method, uri, options, function nippleRequest(err, response) {
    if (err) {
      return callback(err);
    }

    Nipple.read(response, { json: true }, function nippleRead(err, body) {
      if (err) {
        return callback(err);
      }

      callback(null, body);
    });
  });
};
