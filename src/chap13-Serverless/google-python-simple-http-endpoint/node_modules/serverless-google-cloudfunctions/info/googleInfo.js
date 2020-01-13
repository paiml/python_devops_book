'use strict';

const BbPromise = require('bluebird');

const validate = require('../shared/validate');
const setDefaults = require('../shared/utils');
const displayServiceInfo = require('./lib/displayServiceInfo');

class GoogleInfo {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('google');

    Object.assign(
      this,
      validate,
      setDefaults,
      displayServiceInfo);

    this.hooks = {
      'before:info:info': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.setDefaults),

      'deploy:deploy': () => BbPromise.bind(this)
        .then(this.displayServiceInfo),

      'info:info': () => BbPromise.bind(this)
        .then(this.displayServiceInfo),
    };
  }
}

module.exports = GoogleInfo;
