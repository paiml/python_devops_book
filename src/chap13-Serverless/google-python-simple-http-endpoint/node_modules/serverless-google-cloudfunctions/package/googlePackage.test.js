'use strict';

const sinon = require('sinon');
const BbPromise = require('bluebird');

const GoogleProvider = require('../provider/googleProvider');
const GooglePackage = require('./googlePackage');
const Serverless = require('../test/serverless');

describe('GooglePackage', () => {
  let serverless;
  let options;
  let googlePackage;

  beforeEach(() => {
    serverless = new Serverless();
    options = {
      stage: 'my-stage',
      region: 'my-region',
    };
    serverless.setProvider('google', new GoogleProvider(serverless));
    googlePackage = new GooglePackage(serverless, options);
  });

  describe('#constructor()', () => {
    it('should set the serverless instance', () => {
      expect(googlePackage.serverless).toEqual(serverless);
    });

    it('should set options if provided', () => {
      expect(googlePackage.options).toEqual(options);
    });

    it('should make the provider accessible', () => {
      expect(googlePackage.provider).toBeInstanceOf(GoogleProvider);
    });

    describe('hooks', () => {
      let cleanupServerlessDirStub;
      let validateStub;
      let setDefaultsStub;
      let setDeploymentBucketNameStub;
      let prepareDeploymentStub;
      let saveCreateTemplateFileStub;
      let generateArtifactDirectoryNameStub;
      let compileFunctionsStub;
      let mergeServiceResourcesStub;
      let saveUpdateTemplateFileStub;

      beforeEach(() => {
        cleanupServerlessDirStub = sinon.stub(googlePackage, 'cleanupServerlessDir')
          .returns(BbPromise.resolve());
        validateStub = sinon.stub(googlePackage, 'validate')
          .returns(BbPromise.resolve());
        setDefaultsStub = sinon.stub(googlePackage, 'setDefaults')
          .returns(BbPromise.resolve());
        setDeploymentBucketNameStub = sinon.stub(googlePackage, 'setDeploymentBucketName')
          .returns(BbPromise.resolve());
        prepareDeploymentStub = sinon.stub(googlePackage, 'prepareDeployment')
          .returns(BbPromise.resolve());
        saveCreateTemplateFileStub = sinon.stub(googlePackage, 'saveCreateTemplateFile')
          .returns(BbPromise.resolve());
        generateArtifactDirectoryNameStub = sinon.stub(googlePackage, 'generateArtifactDirectoryName')
          .returns(BbPromise.resolve());
        compileFunctionsStub = sinon.stub(googlePackage, 'compileFunctions')
          .returns(BbPromise.resolve());
        mergeServiceResourcesStub = sinon.stub(googlePackage, 'mergeServiceResources')
          .returns(BbPromise.resolve());
        saveUpdateTemplateFileStub = sinon.stub(googlePackage, 'saveUpdateTemplateFile')
          .returns(BbPromise.resolve());
      });

      afterEach(() => {
        googlePackage.cleanupServerlessDir.restore();
        googlePackage.validate.restore();
        googlePackage.setDefaults.restore();
        googlePackage.setDeploymentBucketName.restore();
        googlePackage.prepareDeployment.restore();
        googlePackage.saveCreateTemplateFile.restore();
        googlePackage.generateArtifactDirectoryName.restore();
        googlePackage.compileFunctions.restore();
        googlePackage.mergeServiceResources.restore();
        googlePackage.saveUpdateTemplateFile.restore();
      });

      it('should run "package:cleanup" promise chain', () => googlePackage
        .hooks['package:cleanup']().then(() => {
          expect(cleanupServerlessDirStub.calledOnce).toEqual(true);
        }));

      it('should run "before:package:initialize" promise chain', () => googlePackage
        .hooks['before:package:initialize']().then(() => {
          expect(validateStub.calledOnce).toEqual(true);
          expect(setDefaultsStub.calledAfter(validateStub)).toEqual(true);
        }));

      it('should run "package:initialize" promise chain', () => googlePackage
        .hooks['package:initialize']().then(() => {
          expect(setDeploymentBucketNameStub.calledOnce).toEqual(true);
          expect(prepareDeploymentStub.calledAfter(setDeploymentBucketNameStub)).toEqual(true);
          expect(saveCreateTemplateFileStub.calledAfter(prepareDeploymentStub)).toEqual(true);
        }));

      it('should run "before:package:compileFunctions" promise chain', () => googlePackage
        .hooks['before:package:compileFunctions']().then(() => {
          expect(generateArtifactDirectoryNameStub.calledOnce).toEqual(true);
        }));

      it('should run "package:compileFunctions" promise chain', () => googlePackage
        .hooks['package:compileFunctions']().then(() => {
          expect(compileFunctionsStub.calledOnce).toEqual(true);
        }));

      it('should run "package:finalize" promise chain', () => googlePackage
        .hooks['package:finalize']().then(() => {
          expect(mergeServiceResourcesStub.calledOnce).toEqual(true);
          expect(saveUpdateTemplateFileStub.calledAfter(mergeServiceResourcesStub)).toEqual(true);
        }));
    });
  });
});
