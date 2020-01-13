'use strict';

const BbPromise = require('bluebird');

const validate = require('../shared/validate');
const utils = require('../shared/utils');
const createDeployment = require('./lib/createDeployment');
const setDeploymentBucketName = require('../shared/setDeploymentBucketName');
const monitorDeployment = require('../shared/monitorDeployment');
const uploadArtifacts = require('./lib/uploadArtifacts');
const updateDeployment = require('./lib/updateDeployment');
const cleanupDeploymentBucket = require('./lib/cleanupDeploymentBucket');

class GoogleDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('google');

    Object.assign(
      this,
      validate,
      utils,
      createDeployment,
      setDeploymentBucketName,
      monitorDeployment,
      uploadArtifacts,
      updateDeployment,
      cleanupDeploymentBucket);

    this.hooks = {
      'before:deploy:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.setDefaults),

      'deploy:deploy': () => BbPromise.bind(this)
        .then(this.createDeployment)
        .then(this.setDeploymentBucketName)
        .then(this.uploadArtifacts)
        .then(this.updateDeployment),

      'after:deploy:deploy': () => BbPromise.bind(this)
        .then(this.cleanupDeploymentBucket),
    };
  }
}

module.exports = GoogleDeploy;
