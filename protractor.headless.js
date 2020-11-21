// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter');
const { browser } = require('protractor');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    "browserName": 'chrome',
    "chromeOptions": 
    {
      args: ["--headless","--disable-gpu","--window-size=2048,1080" ],
      binary: "C:/Program Files/Google/Chrome/Application/chrome.exe"
    },
  },
  params: 
  {
    menu:"default"
  },
  directConnect: true,
  //baseUrl:'default',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
