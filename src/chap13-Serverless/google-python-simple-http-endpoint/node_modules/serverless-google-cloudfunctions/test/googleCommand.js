'use strict';

// mock to test functionality in a command unrelated matter
// this mean that not e.g. googleDeploy but the more abstract googleCommand can be used
class GoogleCommand {
  constructor(serverless, options, testSubject) {
    this.options = options;
    this.serverless = serverless;
    this.provider = this.serverless.getProvider('google');

    Object.assign(
      this,
      testSubject);
  }
}

module.exports = GoogleCommand;
