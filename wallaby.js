const path = require('path');
/**
 * Set mode to 'client' or 'server' to run wallaby
 * to run in either mode.
 */

const mode = 'server';

module.exports = function (wallaby) {
  process.env.NODE_PATH +=
    path.delimiter +
    path.join(__dirname, "node_modules") +
    path.delimiter +
    path.join(__dirname, "node_modules/react-scripts/node_modules");
  require("module").Module._initPaths();

  if (mode === 'client') {
    return {
      files: [
          "common/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)",
          "common/views/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)",
          "!common/models/**"
      ],
      tests: ["test/client/*.spec.+(js|jsx|ts|tsx)"],
      env: {
        type: "node",
        runner: "node"
      },
      compilers: {
        "**/*.js?(x)": wallaby.compilers.babel({
            babel: require("babel-core"),
            presets: ["es2015", "react", "stage-2"]
        })
      },
      testFramework: 'jest'
    };
  }
  // else config for 'server' mode:
  return {
    files: [
      'server/**/*.*',
      'server/*.*',
      'common/models/**',
      {pattern: 'node_modules/phantomjs-polyfill/bind-polyfill.js', instrument: false},
      // ES6 promise polyfill
      {pattern: 'node_modules/es6-promise/dist/es6-promise.js', instrument: false},

      {pattern: 'node_modules/chai/chai.js', instrument: false},
      {pattern: 'node_modules/chai-as-promised/lib/chai-as-promised.js', instrument: false}
    ],
    tests: [
      'test/server/*.spec.js',
      'test/server/**/*.spec.js',
      'test/server/utils/fixtures/*.js',
      'test/server/utils/fixtures/*.json'
    ],

    setup: function (wallaby) {
      const mocha = wallaby.testFramework;
      mocha.grep('slow');
      mocha.invert();

      if (global.app) return;
      var path = require('path');
      global.app = require(path.join(process.cwd(), 'server/server.js'));
    },
    delays: {
      run: 5000
    },
    env: {
      type: 'node',
      params: {
        env: 'NODE_ENV=test'
      }
    }
  };
};
