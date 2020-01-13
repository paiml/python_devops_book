'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

const _ = require('lodash');
const google = require('googleapis').google;

const pluginPackageJson = require('../package.json'); // eslint-disable-line import/newline-after-import
const googleApisPackageJson = require(require.resolve('googleapis/package.json')); // eslint-disable-line import/no-dynamic-require

const constants = {
  providerName: 'google',
};

class GoogleProvider {
  static getProviderName() {
    return constants.providerName;
  }

  constructor(serverless) {
    this.serverless = serverless;
    this.provider = this; // only load plugin in a Google service context
    this.serverless.setProvider(constants.providerName, this);

    const serverlessVersion = this.serverless.version;
    const pluginVersion = pluginPackageJson.version;
    const googleApisVersion = googleApisPackageJson.version;

    google.options({
      headers: {
        'User-Agent': `Serverless/${serverlessVersion} Serverless-Google-Provider/${pluginVersion} Googleapis/${googleApisVersion}`,
      },
    });

    this.sdk = {
      google,
      deploymentmanager: google.deploymentmanager('v2'),
      storage: google.storage('v1'),
      logging: google.logging('v2'),
      cloudfunctions: google.cloudfunctions('v1'),
    };
  }

  request() {
    // grab necessary stuff from arguments array
    const lastArg = arguments[Object.keys(arguments).pop()]; //eslint-disable-line
    const hasParams = (typeof lastArg === 'object');
    const filArgs = _.filter(arguments, v => typeof v === 'string'); //eslint-disable-line
    const params = hasParams ? lastArg : {};

    const service = filArgs[0];
    const serviceInstance = this.sdk[service];
    this.isServiceSupported(service);

    const authClient = this.getAuthClient();

    return authClient.authorize().then(() => {
      const requestParams = { auth: authClient };

      // merge the params from the request call into the base functionParams
      _.merge(requestParams, params);

      return filArgs.reduce(((p, c) => p[c]), this.sdk).bind(serviceInstance)(requestParams)
        .then(result => result.data)
        .catch((error) => {
          if (error && error.errors && error.errors[0].message && _.includes(error.errors[0].message, 'project 1043443644444')) {
            throw new Error("Incorrect configuration. Please change the 'project' key in the 'provider' block in your Serverless config file.");
          } else if (error) {
            throw error;
          }
        });
    });
  }

  getAuthClient() {
    let credentials = this.serverless.service.provider.credentials
      || process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const credParts = credentials.split(path.sep);

    if (credParts[0] === '~') {
      credParts[0] = os.homedir();
      credentials = credParts.reduce((memo, part) => path.join(memo, part), '');
    }

    const keyFileContent = fs.readFileSync(credentials).toString();
    const key = JSON.parse(keyFileContent);

    return new google.auth
      .JWT(key.client_email, null, key.private_key, ['https://www.googleapis.com/auth/cloud-platform']);
  }

  isServiceSupported(service) {
    if (!_.includes(Object.keys(this.sdk), service)) {
      const errorMessage = [
        `Unsupported service API "${service}".`,
        ` Supported service APIs are: ${Object.keys(this.sdk).join(', ')}`,
      ].join('');

      throw new Error(errorMessage);
    }
  }
}

module.exports = GoogleProvider;
