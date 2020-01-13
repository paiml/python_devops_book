'use strict';

// mock of the serverless instance
class Serverless {
  constructor() {
    this.providers = {};

    this.service = {};
    this.service.getAllFunctions = function () { //eslint-disable-line
      return Object.keys(this.functions);
    };
    this.service.getFunction = function (functionName) { //eslint-disable-line
      // NOTE the stage is always 'dev'!
      this.functions[functionName]
        .name = `${this.service}-dev-${functionName}`;
      return this.functions[functionName];
    };
    this.utils = {
      writeFileSync() {},
      readFileSync() {},
    };

    this.cli = {
      log() {},
      consoleLog() {},
      printDot() {},
    };

    this.plugins = [];
    this.pluginManager = {
      addPlugin: plugin => this.plugins.push(plugin),
    };
  }

  setProvider(name, provider) {
    this.providers[name] = provider;
  }

  getProvider(name) {
    return this.providers[name];
  }
}

module.exports = Serverless;
