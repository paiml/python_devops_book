'use strict';

const BbPromise = require('bluebird');

const validate = require('../shared/validate');
const setDefaults = require('../shared/utils');
const retrieveLogs = require('./lib/retrieveLogs');

class GoogleLogs {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('google');

    this.commands = {
      logs: {
        lifecycleEvents: [
          'logs',
        ],
        options: {
          count: {
            usage: 'Amount of requested logs',
            shortcut: 'c',
          },
        },
      },
    };

    Object.assign(
      this,
      validate,
      setDefaults,
      retrieveLogs);

    this.hooks = {
      'before:logs:logs': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.setDefaults),

      'logs:logs': () => BbPromise.bind(this)
        .then(this.retrieveLogs),
    };
  }
}

module.exports = GoogleLogs;
