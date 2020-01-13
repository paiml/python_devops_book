'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');

module.exports = {
  setDefaults() {
    this.options.stage = _.get(this, 'options.stage') || _.get(this, 'serverless.service.provider.stage') || 'dev';
    this.options.runtime = _.get(this, 'options.runtime') || 'nodejs8';

    // serverless framework is hard-coding us-east-1 region from aws
    // this is temporary fix for multiple regions
    let region = _.get(this, 'options.region') || _.get(this, 'serverless.service.provider.region');

    if (region === 'us-east-1') {
      region = 'us-central1';
    }

    this.options.region = region;
    this.serverless.service.provider.region = region;

    return BbPromise.resolve();
  },
};
