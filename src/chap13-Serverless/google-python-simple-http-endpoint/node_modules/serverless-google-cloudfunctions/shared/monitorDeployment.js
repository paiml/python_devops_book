'use strict';

/* eslint no-use-before-define: 0 */

const BbPromise = require('bluebird');
const async = require('async');

module.exports = {
  monitorDeployment(deploymentName, action, frequency) {
    const validStatuses = [
      'DONE',
    ];

    let deploymentStatus = null;

    this.serverless.cli.log(`Checking deployment ${action} progress...`);

    return new BbPromise((resolve, reject) => {
      async.whilst(
        () => (validStatuses.indexOf(deploymentStatus) === -1),

        (callback) => {
          setTimeout(() => {
            const params = {
              project: this.serverless.service.provider.project,
            };
            return this.provider.request('deploymentmanager', 'deployments', 'list', params)
              .then((response) => {
                // if actions is "remove" and no deployments are left set to "DONE"
                if (!response.deployments && action === 'remove') {
                  deploymentStatus = 'DONE';
                  callback();
                }

                const deployment = response.deployments.find(dep => dep.name === deploymentName);

                // if actions is "remove" and deployment disappeared then set to "DONE"
                if (!deployment && action === 'remove') {
                  deploymentStatus = 'DONE';
                  callback();
                }

                throwErrorIfDeploymentFails(deployment);

                deploymentStatus = deployment.operation.status;

                this.serverless.cli.printDot();
                return callback();
              })
              .catch((error) => {
                reject(error);
              });
          }, frequency);
        },

        () => {
          // empty console.log for a prettier output
          this.serverless.cli.consoleLog('');
          this.serverless.cli.log('Done...');
          resolve(deploymentStatus);
        });
    });
  },
};

const throwErrorIfDeploymentFails = (deployment) => {
  if (deployment.operation.error && deployment.operation.error.errors.length) {
    const errorCode = deployment.operation.error.errors[0].code;
    const parsedDetails = deployment.operation.error.errors[0].message;
    const errorMessage = [
      `Deployment failed: ${errorCode}\n\n`,
      `     ${parsedDetails}`,
    ].join('');
    throw new Error(errorMessage);
  }
};
