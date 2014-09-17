var Joi = require('joi');

exports.register = function LaunchpadGitHubPlugin(plugin, options, next) {
  plugin.route({
    method: 'POST',
    path: '/github',
    handler: require('./github')(plugin, options),
    config: {
      description: 'Launch on GitHub Pages',
      validate: {
        payload: {
          name: Joi.string().min(2).max(200).required(),
          slug: Joi.string().min(2).max(200).required(),
          description: Joi.string().min(2),
          homepage: Joi.string(),
          private: Joi.any(),
          has_issues: Joi.any(),
          has_wiki: Joi.any(),
          has_downloads: Joi.any()
        }
      }
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
