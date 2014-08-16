module.exports = function(plugin, slug, content) {

  plugin.methods.dns(slug, content, function(err, body) {
    if (err) {
      return console.error(err);
    }

    console.log('Successfully registered a URL record for ' + slug);
    console.log(body);
  });
};
