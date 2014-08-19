var log = require('../../utils/log');

module.exports = function(plugin, slug, content) {
  plugin.methods.dns(slug, content, function(err, body) {
    if (err) {
      return log.error(err);
    }

    log.info('Successfully registered a URL record for ' + slug);
    log.info(body);
  });
};
