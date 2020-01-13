'use strict';

const sinon = require('sinon');
const BbPromise = require('bluebird');

const GoogleProvider = require('../provider/googleProvider');
const GoogleDeploy = require('./googleDeploy');
const Serverless = require('../test/serverless');

describe('GoogleDeploy', () => {
  let serverless;
  let options;
  let googleDeploy;

  beforeEach(() => {
    serverless = new Serverless();
    options = {
      stage: 'my-stage',
      region: 'my-region',
    };
    serverless.setProvider('google', new GoogleProvider(serverless));
    googleDeploy = new GoogleDeploy(serverless, options);
  });

  describe('#constructor()', () => {
    it('should set the serverless instance', () => {
      expect(googleDeploy.serverless).toEqual(serverless);
    });

    it('should set options if provided', () => {
      expect(googleDeploy.options).toEqual(options);
    });

    it('should make the provider accessible', () => {
      expect(googleDeploy.provider).toBeInstanceOf(GoogleProvider);
    });

    describe('hooks', () => {
      let validateStub;
      let setDefaultsStub;
      let createDeploymentStub;
      let setDeploymentBucketNameStub;
      let uploadArtifactsStub;
      let updateDeploymentStub;
      let cleanupDeploymentBucketStub;

      beforeEach(() => {
        validateStub = sinon.stub(googleDeploy, 'validate')
          .returns(BbPromise.resolve());
        setDefaultsStub = sinon.stub(googleDeploy, 'setDefaults')
          .returns(BbPromise.resolve());
        createDeploymentStub = sinon.stub(googleDeploy, 'createDeployment')
          .returns(BbPromise.resolve());
        setDeploymentBucketNameStub = sinon.stub(googleDeploy, 'setDeploymentBucketName')
          .returns(BbPromise.resolve());
        uploadArtifactsStub = sinon.stub(googleDeploy, 'uploadArtifacts')
          .returns(BbPromise.resolve());
        updateDeploymentStub = sinon.stub(googleDeploy, 'updateDeployment')
          .returns(BbPromise.resolve());
        cleanupDeploymentBucketStub = sinon.stub(googleDeploy, 'cleanupDeploymentBucket')
          .returns(BbPromise.resolve());
      });

      afterEach(() => {
        googleDeploy.validate.restore();
        googleDeploy.setDefaults.restore();
        googleDeploy.createDeployment.restore();
        googleDeploy.setDeploymentBucketName.restore();
        googleDeploy.uploadArtifacts.restore();
        googleDeploy.updateDeployment.restore();
        googleDeploy.cleanupDeploymentBucket.restore();
      });

      it('should run "before:deploy:deploy" promise chain', () => googleDeploy
        .hooks['before:deploy:deploy']().then(() => {
          expect(validateStub.calledOnce).toEqual(true);
          expect(setDefaultsStub.calledAfter(validateStub)).toEqual(true);
        }));

      it('should run "deploy:deploy" promise chain', () => googleDeploy
        .hooks['deploy:deploy']().then(() => {
          expect(createDeploymentStub.calledOnce).toEqual(true);
          expect(setDeploymentBucketNameStub.calledAfter(createDeploymentStub)).toEqual(true);
          expect(uploadArtifactsStub.calledAfter(createDeploymentStub)).toEqual(true);
          expect(updateDeploymentStub.calledAfter(uploadArtifactsStub)).toEqual(true);
        }));

      it('should run "after:deploy:deploy" promise chain', () => googleDeploy
        .hooks['after:deploy:deploy']().then(() => {
          expect(cleanupDeploymentBucketStub.calledOnce).toEqual(true);
        }));
    });
  });
});
