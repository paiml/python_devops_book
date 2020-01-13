'use strict';

const BbPromise = require('bluebird');

const cleanupServerlessDir = require('./lib/cleanupServerlessDir');
const validate = require('../shared/validate');
const utils = require('../shared/utils');
const setDeploymentBucketName = require('../shared/setDeploymentBucketName');
const prepareDeployment = require('./lib/prepareDeployment');
const saveCreateTemplateFile = require('./lib/writeFilesToDisk');
const mergeServiceResources = require('./lib/mergeServiceResources');
const generateArtifactDirectoryName = require('./lib/generateArtifactDirectoryName');
const compileFunctions = require('./lib/compileFunctions');
const saveUpdateTemplateFile = require('./lib/writeFilesToDisk');

class GooglePackage {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('google');

    Object.assign(
      this,
      cleanupServerlessDir,
      validate,
      utils,
      setDeploymentBucketName,
      prepareDeployment,
      saveCreateTemplateFile,
      generateArtifactDirectoryName,
      compileFunctions,
      mergeServiceResources,
      saveUpdateTemplateFile);

    this.hooks = {
      'package:cleanup': () => BbPromise.bind(this)
        .then(this.cleanupServerlessDir),

      'before:package:initialize': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.setDefaults),

      'package:initialize': () => BbPromise.bind(this)
        .then(this.setDeploymentBucketName)
        .then(this.prepareDeployment)
        .then(this.saveCreateTemplateFile),

      'before:package:compileFunctions': () => BbPromise.bind(this)
        .then(this.generateArtifactDirectoryName),

      'package:compileFunctions': () => BbPromise.bind(this)
        .then(this.compileFunctions),

      'package:finalize': () => BbPromise.bind(this)
        .then(this.mergeServiceResources)
        .then(this.saveUpdateTemplateFile),
    };
  }
}

module.exports = GooglePackage;
