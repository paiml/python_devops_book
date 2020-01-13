'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

module.exports = {
  validate() {
    return BbPromise.bind(this)
      .then(this.validateServicePath)
      .then(this.validateServiceName)
      .then(this.validateHandlers);
  },

  validateServicePath() {
    if (!this.serverless.config.servicePath) {
      throw new Error('This command can only be run inside a service directory');
    }

    return BbPromise.resolve();
  },

  validateServiceName() {
    const name = this.serverless.service.service;

    // should not contain 'goog'
    if (name.match(/goog/)) {
      throw new Error('Your service should not contain the string "goog"');
    }

    if (name.match(/_+/)) {
      throw new Error('Your service name should not include underscores');
    }

    return BbPromise.resolve();
  },

  validateHandlers() {
    const functions = this.serverless.service.functions;

    _.forEach(functions, (funcVal, funcKey) => {
      if (_.includes(funcVal.handler, '/') || _.includes(funcVal.handler, '.')) {
        const errorMessage = [
          `The "handler" property for the function "${funcKey}" is invalid.`,
          ' Handlers should be plain strings referencing only the exported function name',
          ' without characters such as "." or "/" (so e.g. "http" instead of "index.http").',
          ' Do you want to nest your functions code in a subdirectory?',
          ' Google solves this by utilizing the "main" config in the projects package.json file.',
          ' Please check the docs for more info.',
        ].join('');
        throw new Error(errorMessage);
      }
    });
  },
};
