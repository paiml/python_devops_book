'use strict';

const BbPromise = require('bluebird');

const validate = require('../shared/validate');
const setDefaults = require('../shared/utils');
const setDeploymentBucketName = require('../shared/setDeploymentBucketName');
const emptyDeploymentBucket = require('./lib/emptyDeploymentBucket');
const removeDeployment = require('./lib/removeDeployment');
const monitorDeployment = require('../shared/monitorDeployment');

class GoogleRemove {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('google');

    Object.assign(
      this,
      validate,
      setDefaults,
      setDeploymentBucketName,
      emptyDeploymentBucket,
      removeDeployment,
      monitorDeployment);

    this.hooks = {
      'before:remove:remove': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.setDefaults)
        .then(this.setDeploymentBucketName),

      'remove:remove': () => BbPromise.bind(this)
        .then(this.emptyDeploymentBucket)
        .then(this.removeDeployment),
    };
  }
}

module.exports = GoogleRemove;
