// An example configuration file.
exports.config = {
  directConnect: true,
  // The address of a running selenium server.
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  // seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',
  rootElement: 'html',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      args: ['--test-type']
    }
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/e2e/**/*.spec.js'],

  framework: 'mocha',

  mochaOpts: {
    reporter: 'spec',
    slow: 3000
  }

  // Options to be passed to Jasmine-node.
  //jasmineNodeOpts: {
  //  showColors: true,
  //  defaultTimeoutInterval: 30000
  //},

};
