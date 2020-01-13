'use strict';

const sinon = require('sinon');
const BbPromise = require('bluebird');

const validate = require('./validate');
const GoogleProvider = require('../provider/googleProvider');
const Serverless = require('../test/serverless');
const GoogleCommand = require('../test/googleCommand');

describe('Validate', () => {
  let serverless;
  let googleCommand;

  beforeEach(() => {
    serverless = new Serverless();
    serverless.config = {
      servicePath: true,
    };
    serverless.service = {
      service: 'some-default-service',
    };
    serverless.setProvider('google', new GoogleProvider(serverless));
    googleCommand = new GoogleCommand(serverless, {}, validate);
  });

  describe('#validate()', () => {
    let validateServicePathStub;
    let validateServiceNameStub;
    let validateHandlersStub;

    beforeEach(() => {
      validateServicePathStub = sinon.stub(googleCommand, 'validateServicePath')
        .returns(BbPromise.resolve());
      validateServiceNameStub = sinon.stub(googleCommand, 'validateServiceName')
        .returns(BbPromise.resolve());
      validateHandlersStub = sinon.stub(googleCommand, 'validateHandlers')
        .returns(BbPromise.resolve());
    });

    afterEach(() => {
      googleCommand.validateServicePath.restore();
      googleCommand.validateServiceName.restore();
      googleCommand.validateHandlers.restore();
    });

    it('should run promise chain', () => googleCommand
      .validate().then(() => {
        expect(validateServicePathStub.calledOnce).toEqual(true);
        expect(validateServiceNameStub.calledAfter(validateServicePathStub));
        expect(validateHandlersStub.calledAfter(validateServiceNameStub));
      }));
  });

  describe('#validateServicePath()', () => {
    it('should throw an error if not inside service', () => {
      serverless.config.servicePath = false;

      expect(() => googleCommand.validateServicePath()).toThrow(Error);
    });

    it('should not throw an error if inside service', () => {
      serverless.config.servicePath = true;

      expect(() => googleCommand.validateServicePath()).not.toThrow(Error);
    });
  });

  describe('#validateServiceName()', () => {
    it('should throw an error if the service name contains the string "goog"', () => {
      serverless.service.service = 'service-name-with-goog-in-it';

      expect(() => googleCommand.validateServiceName()).toThrow(Error);
    });

    it('should throw an error if the service name contains underscores', () => {
      serverless.service.service = 'service_name';

      expect(() => googleCommand.validateServiceName()).toThrow(Error);
    });

    it('should not throw an error if the service name is valid', () => {
      serverless.service.service = 'service-name';

      expect(() => googleCommand.validateServiceName()).not.toThrow(Error);
    });
  });

  describe('#validateHandlers()', () => {
    it('should throw an error if the handler name contains an invalid character', () => {
      googleCommand.serverless.service.functions = {
        foo: {
          handler: 'invalid.handler',
        },
        bar: {
          handler: 'invalid/handler',
        },
      };

      expect(() => googleCommand.validateHandlers()).toThrow(Error);
    });

    it('should not throw an error if the function handler is valid', () => {
      googleCommand.serverless.service.functions = {
        foo: {
          handler: 'validHandler',
        },
      };

      expect(() => googleCommand.validateHandlers()).not.toThrow(Error);
    });
  });
});
