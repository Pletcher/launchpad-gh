var Joi = require('joi');

exports.register = function LaunchpadGitHubPlugin(plugin, options, next) {
  plugin.route({
    method: 'POST',
    path: '/github',
    handler: require('./github')(options),
    config: {
      description: 'Launch on GitHub Pages',
      validate: {
        payload: {
          name: Joi.string().min(2).max(200).required(),
          slug: Joi.string().min(2).max(200).required(),
          description: Joi.string().min(2).required(),
          homepage: Joi.string()
        }
      }
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
