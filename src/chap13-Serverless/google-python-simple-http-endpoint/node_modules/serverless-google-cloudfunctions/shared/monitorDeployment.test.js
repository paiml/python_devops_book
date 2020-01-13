'use strict';

const sinon = require('sinon');
const BbPromise = require('bluebird');

const monitorDeployment = require('./monitorDeployment');
const GoogleProvider = require('../provider/googleProvider');
const Serverless = require('../test/serverless');
const GoogleCommand = require('../test/googleCommand');

describe('MonitorDeployment', () => {
  let serverless;
  let googleCommand;
  let consoleLogStub;
  let requestStub;

  beforeEach(() => {
    serverless = new Serverless();
    serverless.service = {
      service: 'my-service',
    };
    serverless.service.provider = {
      project: 'my-project',
    };
    const options = {
      stage: 'dev',
      region: 'us-central1',
    };
    serverless.setProvider('google', new GoogleProvider(serverless));
    googleCommand = new GoogleCommand(serverless, options, monitorDeployment);
    consoleLogStub = sinon.stub(googleCommand.serverless.cli, 'log').returns();
    requestStub = sinon.stub(googleCommand.provider, 'request');
  });

  afterEach(() => {
    googleCommand.serverless.cli.log.restore();
    googleCommand.provider.request.restore();
  });

  describe('#monitorDeployment()', () => {
    describe('when monitoring creations or updates', () => {
      it('should keep monitoring until "DONE" status is reached', () => {
        const deploymentName = 'sls-my-service-dev';
        const response1 = {
          deployments: [
            {
              name: deploymentName,
              operation: {
                status: 'RUNNING',
              },
            },
          ],
        };
        const response2 = {
          deployments: [
            {
              name: deploymentName,
              operation: {
                status: 'DONE',
              },
            },
          ],
        };

        requestStub.onCall(0).returns(BbPromise.resolve(response1));
        requestStub.onCall(1).returns(BbPromise.resolve(response2));

        return googleCommand.monitorDeployment(deploymentName, 'create', 10)
          .then((deploymentStatus) => {
            expect(consoleLogStub.called).toEqual(true);
            expect(requestStub.calledWithExactly(
              'deploymentmanager',
              'deployments',
              'list',
              { project: 'my-project' })).toEqual(true);
            expect(deploymentStatus).toEqual('DONE');
          });
      });

      it('should throw an error if deployment errors out', () => {
        const deploymentName = 'sls-my-service-dev';
        const response = {
          deployments: [
            {
              name: deploymentName,
              operation: {
                error: {
                  errors: [
                    {
                      code: 'ERROR',
                      message: '{ "ResourceErrorMessage": { "details": [ "Error detail"] } }',
                    },
                  ],
                },
              },
            },
          ],
        };

        requestStub.returns(BbPromise.resolve(response));

        return googleCommand.monitorDeployment(deploymentName, 'update', 10).catch((error) => {
          expect(consoleLogStub.called).toEqual(true);
          expect(requestStub.calledWithExactly(
            'deploymentmanager',
            'deployments',
            'list',
            { project: 'my-project' })).toEqual(true);
          expect(error.toString()).toMatch(/Error detail/);
        });
      });
    });

    describe('when monitoring removals', () => {
      it('should stop if there are no deployments and the action is "remove"', () => {
        const deploymentName = 'sls-my-service-dev';
        const response = {};

        requestStub.returns(BbPromise.resolve(response));

        return googleCommand.monitorDeployment(deploymentName, 'remove', 10)
          .then((deploymentStatus) => {
            expect(consoleLogStub.called).toEqual(true);
            expect(requestStub.calledWithExactly(
              'deploymentmanager',
              'deployments',
              'list',
              { project: 'my-project' })).toEqual(true);
            expect(deploymentStatus).toEqual('DONE');
          });
      });

      it('should stop if the deployment is unavailable and the action is "remove"', () => {
        const deploymentName = 'sls-my-service-dev';
        const response = {
          deployments: [
            { name: 'a-different-deployment' },
          ],
        };

        requestStub.returns(BbPromise.resolve(response));

        return googleCommand.monitorDeployment(deploymentName, 'remove', 10)
          .then((deploymentStatus) => {
            expect(consoleLogStub.called).toEqual(true);
            expect(requestStub.calledWithExactly(
              'deploymentmanager',
              'deployments',
              'list',
              { project: 'my-project' })).toEqual(true);
            expect(deploymentStatus).toEqual('DONE');
          });
      });
    });
  });
});
