const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const { browser } = require('protractor');
/*
 @type { import("protractor").Config }
 */

 
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './**/*.e2e-spec.ts'
  ],
  capabilities: {
    "browserName": 'chrome',
    "chromeOptions": 
    {
      args: ["--disable-gpu","--window-size=2048,1080" ],
      binary: "C:/Program Files/Google/Chrome/Application/chrome.exe"
    },
  },
  params: 
  {
    menu:"default"
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: StacktraceOption.PRETTY
      }
    }));
  }
};
