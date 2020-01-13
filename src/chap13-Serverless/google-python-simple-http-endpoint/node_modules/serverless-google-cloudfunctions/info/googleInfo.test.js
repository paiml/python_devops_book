'use strict';

const sinon = require('sinon');
const BbPromise = require('bluebird');

const GoogleProvider = require('../provider/googleProvider');
const GoogleInfo = require('./googleInfo');
const Serverless = require('../test/serverless');

describe('GoogleInfo', () => {
  let serverless;
  let options;
  let googleInfo;

  beforeEach(() => {
    serverless = new Serverless();
    options = {
      stage: 'my-stage',
      region: 'my-region',
    };
    serverless.setProvider('google', new GoogleProvider(serverless));
    googleInfo = new GoogleInfo(serverless, options);
  });

  describe('#constructor()', () => {
    it('should set the serverless instance', () => {
      expect(googleInfo.serverless).toEqual(serverless);
    });

    it('should set options if provided', () => {
      expect(googleInfo.options).toEqual(options);
    });

    it('should make the provider accessible', () => {
      expect(googleInfo.provider).toBeInstanceOf(GoogleProvider);
    });

    describe('hooks', () => {
      let validateStub;
      let setDefaultsStub;
      let displayServiceInfoStub;

      beforeEach(() => {
        validateStub = sinon.stub(googleInfo, 'validate')
          .returns(BbPromise.resolve());
        setDefaultsStub = sinon.stub(googleInfo, 'setDefaults')
          .returns(BbPromise.resolve());
        displayServiceInfoStub = sinon.stub(googleInfo, 'displayServiceInfo')
          .returns(BbPromise.resolve());
      });

      afterEach(() => {
        googleInfo.validate.restore();
        googleInfo.setDefaults.restore();
        googleInfo.displayServiceInfo.restore();
      });

      it('should run "before:info:info" promise chain', () => googleInfo
        .hooks['before:info:info']().then(() => {
          expect(validateStub.calledOnce).toEqual(true);
          expect(setDefaultsStub.calledAfter(validateStub)).toEqual(true);
        }));

      it('should run "deploy:deploy" promise chain', () => googleInfo
        .hooks['deploy:deploy']().then(() => {
          expect(displayServiceInfoStub.calledOnce).toEqual(true);
        }));

      it('should run "info:info" promise chain', () => googleInfo
        .hooks['info:info']().then(() => {
          expect(displayServiceInfoStub.calledOnce).toEqual(true);
        }));
    });
  });
});
