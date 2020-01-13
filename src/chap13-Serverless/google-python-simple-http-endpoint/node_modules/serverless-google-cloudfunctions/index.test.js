'use strict';

const GoogleIndex = require('./index');
const GoogleProvider = require('./provider/googleProvider');
const GooglePackage = require('./package/googlePackage');
const GoogleDeploy = require('./deploy/googleDeploy');
const GoogleRemove = require('./remove/googleRemove');
const GoogleInvoke = require('./invoke/googleInvoke');
const GoogleLogs = require('./logs/googleLogs');
const GoogleInfo = require('./info/googleInfo');
const Serverless = require('./test/serverless');

describe('GoogleIndex', () => {
  let serverless;
  let options;
  let googleIndex;

  beforeEach(() => {
    serverless = new Serverless();
    options = {
      stage: 'my-stage',
      region: 'my-region',
    };
    googleIndex = new GoogleIndex(serverless, options);
  });

  describe('#constructor()', () => {
    it('should set the serverless instance', () => {
      expect(googleIndex.serverless).toEqual(serverless);
    });

    it('should set options if provided', () => {
      expect(googleIndex.options).toEqual(options);
    });

    it('should add all the plugins to the Serverless PluginManager', () => {
      const addedPlugins = serverless.plugins;

      expect(addedPlugins).toContain(GoogleProvider);
      expect(addedPlugins).toContain(GooglePackage);
      expect(addedPlugins).toContain(GoogleDeploy);
      expect(addedPlugins).toContain(GoogleRemove);
      expect(addedPlugins).toContain(GoogleInvoke);
      expect(addedPlugins).toContain(GoogleLogs);
      expect(addedPlugins).toContain(GoogleInfo);
    });
  });
});
