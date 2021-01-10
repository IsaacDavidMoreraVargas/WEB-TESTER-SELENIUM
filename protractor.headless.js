const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './**/*.codeTester.ts'
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
