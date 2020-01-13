'use strict';

const BbPromise = require('bluebird');

const validate = require('../shared/validate');
const setDefaults = require('../shared/utils');
const invokeFunction = require('./lib/invokeFunction');

class GoogleInvoke {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('google');

    Object.assign(
      this,
      validate,
      setDefaults,
      invokeFunction);

    this.hooks = {
      'before:invoke:invoke': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.setDefaults),

      'invoke:invoke': () => BbPromise.bind(this)
        .then(this.invokeFunction),
    };
  }
}

module.exports = GoogleInvoke;
