/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint global-require: warn */
/* eslint no-unused-vars: warn */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const path = require('path');
const util = require('util');
const execute = require('child_process').execSync;
const fs = require('fs-extra');
const mocha = require('mocha');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');
const Ajv = require('ajv');

const ajv = new Ajv({ strictSchema: false, allErrors: true, allowUnionTypes: true });
const anything = td.matchers.anything();
let logLevel = 'none';
const isRapidFail = false;

// read in the properties from the sampleProperties files
let adaptdir = __dirname;
if (adaptdir.endsWith('/test/integration')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 17);
} else if (adaptdir.endsWith('/test/unit')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 10);
}
const samProps = require(`${adaptdir}/sampleProperties.json`).properties;

// these variables can be changed to run in integrated mode so easier to set them here
// always check these in with bogus data!!!
samProps.stub = true;
samProps.host = 'replace.hostorip.here';
samProps.authentication.username = 'username';
samProps.authentication.password = 'password';
samProps.protocol = 'http';
samProps.port = 80;
samProps.ssl.enabled = false;
samProps.ssl.accept_invalid_cert = false;
samProps.request.attempt_timeout = 1200000;
const attemptTimeout = samProps.request.attempt_timeout;
const { stub } = samProps;

// these are the adapter properties. You generally should not need to alter
// any of these after they are initially set up
global.pronghornProps = {
  pathProps: {
    encrypted: false
  },
  adapterProps: {
    adapters: [{
      id: 'Test-nokia_nsp_network_management',
      type: 'NokiaNspNetworkManagement',
      properties: samProps
    }]
  }
};

global.$HOME = `${__dirname}/../..`;

// set the log levels that Pronghorn uses, spam and trace are not defaulted in so without
// this you may error on log.trace calls.
const myCustomLevels = {
  levels: {
    spam: 6,
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    none: 0
  }
};

// need to see if there is a log level passed in
process.argv.forEach((val) => {
  // is there a log level defined to be passed in?
  if (val.indexOf('--LOG') === 0) {
    // get the desired log level
    const inputVal = val.split('=')[1];

    // validate the log level is supported, if so set it
    if (Object.hasOwnProperty.call(myCustomLevels.levels, inputVal)) {
      logLevel = inputVal;
    }
  }
});

// need to set global logging
global.log = winston.createLogger({
  level: logLevel,
  levels: myCustomLevels.levels,
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * Runs the error asserts for the test
 */
function runErrorAsserts(data, error, code, origin, displayStr) {
  assert.equal(null, data);
  assert.notEqual(undefined, error);
  assert.notEqual(null, error);
  assert.notEqual(undefined, error.IAPerror);
  assert.notEqual(null, error.IAPerror);
  assert.notEqual(undefined, error.IAPerror.displayString);
  assert.notEqual(null, error.IAPerror.displayString);
  assert.equal(code, error.icode);
  assert.equal(origin, error.IAPerror.origin);
  assert.equal(displayStr, error.IAPerror.displayString);
}

// require the adapter that we are going to be using
const NokiaNspNetworkManagement = require('../../adapter');

// delete the .DS_Store directory in entities -- otherwise this will cause errors
const dirPath = path.join(__dirname, '../../entities/.DS_Store');
if (fs.existsSync(dirPath)) {
  try {
    fs.removeSync(dirPath);
    console.log('.DS_Store deleted');
  } catch (e) {
    console.log('Error when deleting .DS_Store:', e);
  }
}

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[unit] nokia_nsp_network_management Adapter Test', () => {
  describe('NokiaNspNetworkManagement Class Tests', () => {
    const a = new NokiaNspNetworkManagement(
      pronghornProps.adapterProps.adapters[0].id,
      pronghornProps.adapterProps.adapters[0].properties
    );

    if (isRapidFail) {
      const state = {};
      state.passed = true;

      mocha.afterEach(function x() {
        state.passed = state.passed
        && (this.currentTest.state === 'passed');
      });
      mocha.beforeEach(function x() {
        if (!state.passed) {
          return this.currentTest.skip();
        }
        return true;
      });
    }

    describe('#class instance created', () => {
      it('should be a class with properties', (done) => {
        try {
          assert.notEqual(null, a);
          assert.notEqual(undefined, a);
          const checkId = global.pronghornProps.adapterProps.adapters[0].id;
          assert.equal(checkId, a.id);
          assert.notEqual(null, a.allProps);
          const check = global.pronghornProps.adapterProps.adapters[0].properties.healthcheck.type;
          assert.equal(check, a.healthcheckType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('adapterBase.js', () => {
      it('should have an adapterBase.js', (done) => {
        try {
          fs.exists('adapterBase.js', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    let wffunctions = [];
    describe('#iapGetAdapterWorkflowFunctions', () => {
      it('should retrieve workflow functions', (done) => {
        try {
          wffunctions = a.iapGetAdapterWorkflowFunctions([]);

          try {
            assert.notEqual(0, wffunctions.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('package.json', () => {
      it('should have a package.json', (done) => {
        try {
          fs.exists('package.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json should be validated', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          // Define the JSON schema for package.json
          const packageJsonSchema = {
            type: 'object',
            properties: {
              name: { type: 'string' },
              version: { type: 'string' }
              // May need to add more properties as needed
            },
            required: ['name', 'version']
          };
          const validate = ajv.compile(packageJsonSchema);
          const isValid = validate(packageDotJson);

          if (isValid === false) {
            log.error('The package.json contains errors');
            assert.equal(true, isValid);
          } else {
            assert.equal(true, isValid);
          }

          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json standard fields should be customized', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(-1, packageDotJson.name.indexOf('nokia_nsp_network_management'));
          assert.notEqual(undefined, packageDotJson.version);
          assert.notEqual(null, packageDotJson.version);
          assert.notEqual('', packageDotJson.version);
          assert.notEqual(undefined, packageDotJson.description);
          assert.notEqual(null, packageDotJson.description);
          assert.notEqual('', packageDotJson.description);
          assert.equal('adapter.js', packageDotJson.main);
          assert.notEqual(undefined, packageDotJson.wizardVersion);
          assert.notEqual(null, packageDotJson.wizardVersion);
          assert.notEqual('', packageDotJson.wizardVersion);
          assert.notEqual(undefined, packageDotJson.engineVersion);
          assert.notEqual(null, packageDotJson.engineVersion);
          assert.notEqual('', packageDotJson.engineVersion);
          assert.equal('http', packageDotJson.adapterType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper scripts should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.scripts);
          assert.notEqual(null, packageDotJson.scripts);
          assert.notEqual('', packageDotJson.scripts);
          assert.equal('node utils/setup.js', packageDotJson.scripts.preinstall);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js', packageDotJson.scripts.lint);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js --quiet', packageDotJson.scripts['lint:errors']);
          assert.equal('mocha test/unit/adapterBaseTestUnit.js --LOG=error', packageDotJson.scripts['test:baseunit']);
          assert.equal('mocha test/unit/adapterTestUnit.js --LOG=error', packageDotJson.scripts['test:unit']);
          assert.equal('mocha test/integration/adapterTestIntegration.js --LOG=error', packageDotJson.scripts['test:integration']);
          assert.equal('npm run test:baseunit && npm run test:unit && npm run test:integration', packageDotJson.scripts.test);
          assert.equal('npm publish --registry=https://registry.npmjs.org --access=public', packageDotJson.scripts.deploy);
          assert.equal('npm run deploy', packageDotJson.scripts.build);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper directories should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.repository);
          assert.notEqual(null, packageDotJson.repository);
          assert.notEqual('', packageDotJson.repository);
          assert.equal('git', packageDotJson.repository.type);
          assert.equal('git@gitlab.com:itentialopensource/adapters/', packageDotJson.repository.url.substring(0, 43));
          assert.equal('https://gitlab.com/itentialopensource/adapters/', packageDotJson.homepage.substring(0, 47));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.dependencies);
          assert.notEqual(null, packageDotJson.dependencies);
          assert.notEqual('', packageDotJson.dependencies);
          assert.equal('^8.17.1', packageDotJson.dependencies.ajv);
          assert.equal('^1.7.2', packageDotJson.dependencies.axios);
          assert.equal('^11.0.0', packageDotJson.dependencies.commander);
          assert.equal('^11.2.0', packageDotJson.dependencies['fs-extra']);
          assert.equal('^10.7.0', packageDotJson.dependencies.mocha);
          assert.equal('^2.0.1', packageDotJson.dependencies['mocha-param']);
          assert.equal('^0.4.4', packageDotJson.dependencies.ping);
          assert.equal('^1.4.10', packageDotJson.dependencies['readline-sync']);
          assert.equal('^7.6.3', packageDotJson.dependencies.semver);
          assert.equal('^3.13.1', packageDotJson.dependencies.winston);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dev dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.devDependencies);
          assert.notEqual(null, packageDotJson.devDependencies);
          assert.notEqual('', packageDotJson.devDependencies);
          assert.equal('^4.3.7', packageDotJson.devDependencies.chai);
          assert.equal('^8.44.0', packageDotJson.devDependencies.eslint);
          assert.equal('^15.0.0', packageDotJson.devDependencies['eslint-config-airbnb-base']);
          assert.equal('^2.27.5', packageDotJson.devDependencies['eslint-plugin-import']);
          assert.equal('^3.1.0', packageDotJson.devDependencies['eslint-plugin-json']);
          assert.equal('^3.18.0', packageDotJson.devDependencies.testdouble);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('pronghorn.json', () => {
      it('should have a pronghorn.json', (done) => {
        try {
          fs.exists('pronghorn.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should be customized', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(-1, pronghornDotJson.id.indexOf('nokia_nsp_network_management'));
          assert.equal('Adapter', pronghornDotJson.type);
          assert.equal('NokiaNspNetworkManagement', pronghornDotJson.export);
          assert.equal('nokia_nsp_network_management', pronghornDotJson.title);
          assert.equal('adapter.js', pronghornDotJson.src);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should contain generic adapter methods', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(undefined, pronghornDotJson.methods);
          assert.notEqual(null, pronghornDotJson.methods);
          assert.notEqual('', pronghornDotJson.methods);
          assert.equal(true, Array.isArray(pronghornDotJson.methods));
          assert.notEqual(0, pronghornDotJson.methods.length);
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUpdateAdapterConfiguration'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapSuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUnsuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterQueue'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapFindAdapterPath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapTroubleshootAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterHealthcheck'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterConnectivity'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterBasicGet'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapMoveAdapterEntitiesToDB'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapDeactivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapActivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapPopulateEntityCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRetrieveEntitiesCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevice'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevicesFiltered'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'isAlive'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getConfig'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetDeviceCount'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapExpandedGenericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequestNoBasePath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterLint'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterTests'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterInventory'));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should only expose workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');

          for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
            let found = false;
            let paramissue = false;

            for (let w = 0; w < wffunctions.length; w += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                const methLine = execute(`grep "  ${wffunctions[w]}(" adapter.js | grep "callback) {"`).toString();
                let wfparams = [];

                if (methLine && methLine.indexOf('(') >= 0 && methLine.indexOf(')') >= 0) {
                  const temp = methLine.substring(methLine.indexOf('(') + 1, methLine.lastIndexOf(')'));
                  wfparams = temp.split(',');

                  for (let t = 0; t < wfparams.length; t += 1) {
                    // remove default value from the parameter name
                    wfparams[t] = wfparams[t].substring(0, wfparams[t].search(/=/) > 0 ? wfparams[t].search(/#|\?|=/) : wfparams[t].length);
                    // remove spaces
                    wfparams[t] = wfparams[t].trim();

                    if (wfparams[t] === 'callback') {
                      wfparams.splice(t, 1);
                    }
                  }
                }

                // if there are inputs defined but not on the method line
                if (wfparams.length === 0 && (pronghornDotJson.methods[m].input
                    && pronghornDotJson.methods[m].input.length > 0)) {
                  paramissue = true;
                } else if (wfparams.length > 0 && (!pronghornDotJson.methods[m].input
                    || pronghornDotJson.methods[m].input.length === 0)) {
                  // if there are no inputs defined but there are on the method line
                  paramissue = true;
                } else {
                  for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                    let pfound = false;
                    for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                  for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                    let pfound = false;
                    for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                }

                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} not found in workflow functions`);
            }
            if (paramissue) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} has a parameter mismatch`);
            }
            assert.equal(true, found);
            assert.equal(false, paramissue);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('pronghorn.json should expose all workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          for (let w = 0; w < wffunctions.length; w += 1) {
            let found = false;

            for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${wffunctions[w]} not found in pronghorn.json`);
            }
            assert.equal(true, found);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json verify input/output schema objects', (done) => {
        const verifySchema = (methodName, schema) => {
          try {
            ajv.compile(schema);
          } catch (error) {
            const errorMessage = `Invalid schema found in '${methodName}' method.
          Schema => ${JSON.stringify(schema)}.
          Details => ${error.message}`;
            throw new Error(errorMessage);
          }
        };

        try {
          const pronghornDotJson = require('../../pronghorn.json');
          const { methods } = pronghornDotJson;
          for (let i = 0; i < methods.length; i += 1) {
            for (let j = 0; j < methods[i].input.length; j += 1) {
              const inputSchema = methods[i].input[j].schema;
              if (inputSchema) {
                verifySchema(methods[i].name, inputSchema);
              }
            }
            const outputSchema = methods[i].output.schema;
            if (outputSchema) {
              verifySchema(methods[i].name, outputSchema);
            }
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('propertiesSchema.json', () => {
      it('should have a propertiesSchema.json', (done) => {
        try {
          fs.exists('propertiesSchema.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should be customized', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.equal('adapter-nokia_nsp_network_management', propertiesDotJson.$id);
          assert.equal('object', propertiesDotJson.type);
          assert.equal('http://json-schema.org/draft-07/schema#', propertiesDotJson.$schema);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should contain generic adapter properties', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.notEqual(undefined, propertiesDotJson.properties);
          assert.notEqual(null, propertiesDotJson.properties);
          assert.notEqual('', propertiesDotJson.properties);
          assert.equal('string', propertiesDotJson.properties.host.type);
          assert.equal('integer', propertiesDotJson.properties.port.type);
          assert.equal('boolean', propertiesDotJson.properties.stub.type);
          assert.equal('string', propertiesDotJson.properties.protocol.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.authentication);
          assert.notEqual(null, propertiesDotJson.definitions.authentication);
          assert.notEqual('', propertiesDotJson.definitions.authentication);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.auth_method.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.invalid_token_error.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.token_timeout.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token_cache.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field.type));
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field_format.type));
          assert.equal('boolean', propertiesDotJson.definitions.authentication.properties.auth_logging.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_id.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_secret.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.grant_type.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.ssl);
          assert.notEqual(null, propertiesDotJson.definitions.ssl);
          assert.notEqual('', propertiesDotJson.definitions.ssl);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ecdhCurve.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.cert_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.secure_protocol.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ciphers.type);
          assert.equal('string', propertiesDotJson.properties.base_path.type);
          assert.equal('string', propertiesDotJson.properties.version.type);
          assert.equal('string', propertiesDotJson.properties.cache_location.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_pathvars.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_queryvars.type);
          assert.equal(true, Array.isArray(propertiesDotJson.properties.save_metric.type));
          assert.notEqual(undefined, propertiesDotJson.definitions);
          assert.notEqual(null, propertiesDotJson.definitions);
          assert.notEqual('', propertiesDotJson.definitions);
          assert.notEqual(undefined, propertiesDotJson.definitions.healthcheck);
          assert.notEqual(null, propertiesDotJson.definitions.healthcheck);
          assert.notEqual('', propertiesDotJson.definitions.healthcheck);
          assert.equal('string', propertiesDotJson.definitions.healthcheck.properties.type.type);
          assert.equal('integer', propertiesDotJson.definitions.healthcheck.properties.frequency.type);
          assert.equal('object', propertiesDotJson.definitions.healthcheck.properties.query_object.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.throttle);
          assert.notEqual(null, propertiesDotJson.definitions.throttle);
          assert.notEqual('', propertiesDotJson.definitions.throttle);
          assert.equal('boolean', propertiesDotJson.definitions.throttle.properties.throttle_enabled.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.number_pronghorns.type);
          assert.equal('string', propertiesDotJson.definitions.throttle.properties.sync_async.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.max_in_queue.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.concurrent_max.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.expire_timeout.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.avg_runtime.type);
          assert.equal('array', propertiesDotJson.definitions.throttle.properties.priorities.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.request);
          assert.notEqual(null, propertiesDotJson.definitions.request);
          assert.notEqual('', propertiesDotJson.definitions.request);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_redirects.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_retries.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.request.properties.limit_retry_error.type));
          assert.equal('array', propertiesDotJson.definitions.request.properties.failover_codes.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.attempt_timeout.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.payload.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.uriOptions.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.addlHeaders.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.authData.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.healthcheck_on_timeout.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_raw.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.archiving.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_request.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.proxy);
          assert.notEqual(null, propertiesDotJson.definitions.proxy);
          assert.notEqual('', propertiesDotJson.definitions.proxy);
          assert.equal('boolean', propertiesDotJson.definitions.proxy.properties.enabled.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.proxy.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.protocol.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.password.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.mongo);
          assert.notEqual(null, propertiesDotJson.definitions.mongo);
          assert.notEqual('', propertiesDotJson.definitions.mongo);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.mongo.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.database.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.replSet.type);
          assert.equal('object', propertiesDotJson.definitions.mongo.properties.db_ssl.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.cert_file.type);
          assert.notEqual('', propertiesDotJson.definitions.devicebroker);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevice.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevicesFiltered.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.isAlive.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getConfig.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getCount.type);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('error.json', () => {
      it('should have an error.json', (done) => {
        try {
          fs.exists('error.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('error.json should have standard adapter errors', (done) => {
        try {
          const errorDotJson = require('../../error.json');
          assert.notEqual(undefined, errorDotJson.errors);
          assert.notEqual(null, errorDotJson.errors);
          assert.notEqual('', errorDotJson.errors);
          assert.equal(true, Array.isArray(errorDotJson.errors));
          assert.notEqual(0, errorDotJson.errors.length);
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.100'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.101'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.102'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.110'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.111'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.112'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.113'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.114'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.115'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.116'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.300'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.301'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.302'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.303'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.304'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.305'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.310'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.311'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.312'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.320'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.321'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.400'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.401'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.402'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.500'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.501'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.502'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.503'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.600'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.900'));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('sampleProperties.json', () => {
      it('should have a sampleProperties.json', (done) => {
        try {
          fs.exists('sampleProperties.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('sampleProperties.json should contain generic adapter properties', (done) => {
        try {
          const sampleDotJson = require('../../sampleProperties.json');
          assert.notEqual(-1, sampleDotJson.id.indexOf('nokia_nsp_network_management'));
          assert.equal('NokiaNspNetworkManagement', sampleDotJson.type);
          assert.notEqual(undefined, sampleDotJson.properties);
          assert.notEqual(null, sampleDotJson.properties);
          assert.notEqual('', sampleDotJson.properties);
          assert.notEqual(undefined, sampleDotJson.properties.host);
          assert.notEqual(undefined, sampleDotJson.properties.port);
          assert.notEqual(undefined, sampleDotJson.properties.stub);
          assert.notEqual(undefined, sampleDotJson.properties.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.authentication);
          assert.notEqual(null, sampleDotJson.properties.authentication);
          assert.notEqual('', sampleDotJson.properties.authentication);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_method);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.username);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.password);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.invalid_token_error);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_cache);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field_format);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_logging);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_id);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_secret);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.grant_type);
          assert.notEqual(undefined, sampleDotJson.properties.ssl);
          assert.notEqual(null, sampleDotJson.properties.ssl);
          assert.notEqual('', sampleDotJson.properties.ssl);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ecdhCurve);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.secure_protocol);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ciphers);
          assert.notEqual(undefined, sampleDotJson.properties.base_path);
          assert.notEqual(undefined, sampleDotJson.properties.version);
          assert.notEqual(undefined, sampleDotJson.properties.cache_location);
          assert.notEqual(undefined, sampleDotJson.properties.encode_pathvars);
          assert.notEqual(undefined, sampleDotJson.properties.encode_queryvars);
          assert.notEqual(undefined, sampleDotJson.properties.save_metric);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck);
          assert.notEqual(null, sampleDotJson.properties.healthcheck);
          assert.notEqual('', sampleDotJson.properties.healthcheck);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.type);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.frequency);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.query_object);
          assert.notEqual(undefined, sampleDotJson.properties.throttle);
          assert.notEqual(null, sampleDotJson.properties.throttle);
          assert.notEqual('', sampleDotJson.properties.throttle);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.throttle_enabled);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.number_pronghorns);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.sync_async);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.max_in_queue);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.concurrent_max);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.expire_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.avg_runtime);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.priorities);
          assert.notEqual(undefined, sampleDotJson.properties.request);
          assert.notEqual(null, sampleDotJson.properties.request);
          assert.notEqual('', sampleDotJson.properties.request);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_redirects);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_retries);
          assert.notEqual(undefined, sampleDotJson.properties.request.limit_retry_error);
          assert.notEqual(undefined, sampleDotJson.properties.request.failover_codes);
          assert.notEqual(undefined, sampleDotJson.properties.request.attempt_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.payload);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.uriOptions);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.addlHeaders);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.authData);
          assert.notEqual(undefined, sampleDotJson.properties.request.healthcheck_on_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_raw);
          assert.notEqual(undefined, sampleDotJson.properties.request.archiving);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_request);
          assert.notEqual(undefined, sampleDotJson.properties.proxy);
          assert.notEqual(null, sampleDotJson.properties.proxy);
          assert.notEqual('', sampleDotJson.properties.proxy);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.host);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.port);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.username);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo);
          assert.notEqual(null, sampleDotJson.properties.mongo);
          assert.notEqual('', sampleDotJson.properties.mongo);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.host);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.port);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.database);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.username);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.replSet);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevice);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevicesFiltered);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.isAlive);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getConfig);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getCount);
          assert.notEqual(undefined, sampleDotJson.properties.cache);
          assert.notEqual(undefined, sampleDotJson.properties.cache.entities);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkProperties', () => {
      it('should have a checkProperties function', (done) => {
        try {
          assert.equal(true, typeof a.checkProperties === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the sample properties should be good - if failure change the log level', (done) => {
        try {
          const samplePropsJson = require('../../sampleProperties.json');
          const clean = a.checkProperties(samplePropsJson.properties);

          try {
            assert.notEqual(0, Object.keys(clean));
            assert.equal(undefined, clean.exception);
            assert.notEqual(undefined, clean.host);
            assert.notEqual(null, clean.host);
            assert.notEqual('', clean.host);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('README.md', () => {
      it('should have a README', (done) => {
        try {
          fs.exists('README.md', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('README.md should be customized', (done) => {
        try {
          fs.readFile('README.md', 'utf8', (err, data) => {
            assert.equal(-1, data.indexOf('[System]'));
            assert.equal(-1, data.indexOf('[system]'));
            assert.equal(-1, data.indexOf('[version]'));
            assert.equal(-1, data.indexOf('[namespace]'));
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#connect', () => {
      it('should have a connect function', (done) => {
        try {
          assert.equal(true, typeof a.connect === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should have a healthCheck function', (done) => {
        try {
          assert.equal(true, typeof a.healthCheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapUpdateAdapterConfiguration', () => {
      it('should have a iapUpdateAdapterConfiguration function', (done) => {
        try {
          assert.equal(true, typeof a.iapUpdateAdapterConfiguration === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapSuspendAdapter', () => {
      it('should have a iapSuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapSuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapUnsuspendAdapter', () => {
      it('should have a iapUnsuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapUnsuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterQueue', () => {
      it('should have a iapGetAdapterQueue function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterQueue === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapFindAdapterPath', () => {
      it('should have a iapFindAdapterPath function', (done) => {
        try {
          assert.equal(true, typeof a.iapFindAdapterPath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('iapFindAdapterPath should find atleast one path that matches', (done) => {
        try {
          a.iapFindAdapterPath('{base_path}/{version}', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.equal(true, data.found);
              assert.notEqual(undefined, data.foundIn);
              assert.notEqual(null, data.foundIn);
              assert.notEqual(0, data.foundIn.length);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#iapTroubleshootAdapter', () => {
      it('should have a iapTroubleshootAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapTroubleshootAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterHealthcheck', () => {
      it('should have a iapRunAdapterHealthcheck function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterHealthcheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterConnectivity', () => {
      it('should have a iapRunAdapterConnectivity function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterConnectivity === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterBasicGet', () => {
      it('should have a iapRunAdapterBasicGet function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterBasicGet === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapMoveAdapterEntitiesToDB', () => {
      it('should have a iapMoveAdapterEntitiesToDB function', (done) => {
        try {
          assert.equal(true, typeof a.iapMoveAdapterEntitiesToDB === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkActionFiles', () => {
      it('should have a checkActionFiles function', (done) => {
        try {
          assert.equal(true, typeof a.checkActionFiles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the action files should be good - if failure change the log level as most issues are warnings', (done) => {
        try {
          const clean = a.checkActionFiles();

          try {
            for (let c = 0; c < clean.length; c += 1) {
              log.error(clean[c]);
            }
            assert.equal(0, clean.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#encryptProperty', () => {
      it('should have a encryptProperty function', (done) => {
        try {
          assert.equal(true, typeof a.encryptProperty === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('should get base64 encoded property', (done) => {
        try {
          a.encryptProperty('testing', 'base64', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{code}'));
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should get encrypted property', (done) => {
        try {
          a.encryptProperty('testing', 'encrypt', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{crypt}'));
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#iapDeactivateTasks', () => {
      it('should have a iapDeactivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapDeactivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapActivateTasks', () => {
      it('should have a iapActivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapActivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapPopulateEntityCache', () => {
      it('should have a iapPopulateEntityCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapPopulateEntityCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRetrieveEntitiesCache', () => {
      it('should have a iapRetrieveEntitiesCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapRetrieveEntitiesCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#hasEntities', () => {
      it('should have a hasEntities function', (done) => {
        try {
          assert.equal(true, typeof a.hasEntities === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevice', () => {
      it('should have a getDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevicesFiltered', () => {
      it('should have a getDevicesFiltered function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesFiltered === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#isAlive', () => {
      it('should have a isAlive function', (done) => {
        try {
          assert.equal(true, typeof a.isAlive === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getConfig', () => {
      it('should have a getConfig function', (done) => {
        try {
          assert.equal(true, typeof a.getConfig === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetDeviceCount', () => {
      it('should have a iapGetDeviceCount function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetDeviceCount === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapExpandedGenericAdapterRequest', () => {
      it('should have a iapExpandedGenericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.iapExpandedGenericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequest', () => {
      it('should have a genericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequestNoBasePath', () => {
      it('should have a genericAdapterRequestNoBasePath function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequestNoBasePath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterLint', () => {
      it('should have a iapRunAdapterLint function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterLint === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the lint results', (done) => {
        try {
          a.iapRunAdapterLint((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.status);
              assert.notEqual(null, data.status);
              assert.equal('SUCCESS', data.status);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#iapRunAdapterTests', () => {
      it('should have a iapRunAdapterTests function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterTests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterInventory', () => {
      it('should have a iapGetAdapterInventory function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterInventory === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the inventory', (done) => {
        try {
          a.iapGetAdapterInventory((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });
    describe('metadata.json', () => {
      it('should have a metadata.json', (done) => {
        try {
          fs.exists('metadata.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json is customized', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.equal('adapter-nokia_nsp_network_management', metadataDotJson.name);
          assert.notEqual(undefined, metadataDotJson.webName);
          assert.notEqual(null, metadataDotJson.webName);
          assert.notEqual('', metadataDotJson.webName);
          assert.equal('Adapter', metadataDotJson.type);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json contains accurate documentation', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.documentation);
          assert.equal('https://www.npmjs.com/package/@itentialopensource/adapter-nokia_nsp_network_management', metadataDotJson.documentation.npmLink);
          assert.equal('https://docs.itential.com/opensource/docs/troubleshooting-an-adapter', metadataDotJson.documentation.faqLink);
          assert.equal('https://gitlab.com/itentialopensource/adapters/contributing-guide', metadataDotJson.documentation.contributeLink);
          assert.equal('https://itential.atlassian.net/servicedesk/customer/portals', metadataDotJson.documentation.issueLink);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json has related items', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.relatedItems);
          assert.notEqual(undefined, metadataDotJson.relatedItems.adapters);
          assert.notEqual(undefined, metadataDotJson.relatedItems.integrations);
          assert.notEqual(undefined, metadataDotJson.relatedItems.ecosystemApplications);
          assert.notEqual(undefined, metadataDotJson.relatedItems.workflowProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.transformationProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.exampleProjects);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });
    /*
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    *** All code above this comment will be replaced during a migration ***
    ******************* DO NOT REMOVE THIS COMMENT BLOCK ******************
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    */

    describe('#retrieveNetworkInterfaces - errors', () => {
      it('should have a retrieveNetworkInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkInterfaces(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkInterfaces('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkInterfacesConfig - errors', () => {
      it('should have a retrieveNetworkInterfacesConfig function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkInterfacesConfig === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkInterfacesConfig(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesConfig', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkInterfacesConfig('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesConfig', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkSubInterfaces - errors', () => {
      it('should have a retrieveNetworkSubInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkSubInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkSubInterfaces(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkSubInterfaces('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkSubInterfacesConfig - errors', () => {
      it('should have a retrieveNetworkSubInterfacesConfig function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkSubInterfacesConfig === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkSubInterfacesConfig(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesConfig', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkSubInterfacesConfig('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesConfig', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subinterface', (done) => {
        try {
          a.retrieveNetworkSubInterfacesConfig('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'subinterface is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesConfig', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkSubInterfacesState - errors', () => {
      it('should have a retrieveNetworkSubInterfacesState function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkSubInterfacesState === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkSubInterfacesState(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesState', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkSubInterfacesState('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesState', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subinterface', (done) => {
        try {
          a.retrieveNetworkSubInterfacesState('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'subinterface is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesState', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkSubInterfacesIPv4Addresses - errors', () => {
      it('should have a retrieveNetworkSubInterfacesIPv4Addresses function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkSubInterfacesIPv4Addresses === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv4Addresses(null, null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesIPv4Addresses', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv4Addresses('fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesIPv4Addresses', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing interfaceParam', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv4Addresses('fakeparam', 'fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'interfaceParam is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesIPv4Addresses', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subinterface', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv4Addresses('fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'subinterface is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesIPv4Addresses', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkSubInterfacesIPv6Addresses - errors', () => {
      it('should have a retrieveNetworkSubInterfacesIPv6Addresses function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkSubInterfacesIPv6Addresses === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv6Addresses(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesIPv6Addresses', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv6Addresses('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesIPv6Addresses', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subinterface', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv6Addresses('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'subinterface is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkSubInterfacesIPv6Addresses', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkInterfacesUnnumbered - errors', () => {
      it('should have a retrieveNetworkInterfacesUnnumbered function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkInterfacesUnnumbered === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumbered(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesUnnumbered', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumbered('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesUnnumbered', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subinterface', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumbered('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'subinterface is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesUnnumbered', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkInterfacesUnnumberedIntf - errors', () => {
      it('should have a retrieveNetworkInterfacesUnnumberedIntf function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkInterfacesUnnumberedIntf === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumberedIntf(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesUnnumberedIntf', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumberedIntf('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesUnnumberedIntf', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subinterface', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumberedIntf('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'subinterface is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInterfacesUnnumberedIntf', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveNetworkInstance - errors', () => {
      it('should have a retrieveNetworkInstance function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveNetworkInstance === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.retrieveNetworkInstance(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInstance', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveNetworkInstance('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveNetworkInstance', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveResyncPolicyNodeVersionEntity - errors', () => {
      it('should have a retrieveResyncPolicyNodeVersionEntity function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveResyncPolicyNodeVersionEntity === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing resyncPolicy', (done) => {
        try {
          a.retrieveResyncPolicyNodeVersionEntity(null, null, null, (data, error) => {
            try {
              const displayE = 'resyncPolicy is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPolicyNodeVersionEntity', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveResyncPolicyNodeVersionEntity('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPolicyNodeVersionEntity', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing version', (done) => {
        try {
          a.retrieveResyncPolicyNodeVersionEntity('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'version is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPolicyNodeVersionEntity', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createUsingIntent - errors', () => {
      it('should have a createUsingIntent function', (done) => {
        try {
          assert.equal(true, typeof a.createUsingIntent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createUsingIntent(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createUsingIntent', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#synchronizeIntent - errors', () => {
      it('should have a synchronizeIntent function', (done) => {
        try {
          assert.equal(true, typeof a.synchronizeIntent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing intent', (done) => {
        try {
          a.synchronizeIntent(null, (data, error) => {
            try {
              const displayE = 'intent is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-synchronizeIntent', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIntent - errors', () => {
      it('should have a getIntent function', (done) => {
        try {
          assert.equal(true, typeof a.getIntent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing intent', (done) => {
        try {
          a.getIntent(null, (data, error) => {
            try {
              const displayE = 'intent is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getIntent', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#modifyIntent - errors', () => {
      it('should have a modifyIntent function', (done) => {
        try {
          assert.equal(true, typeof a.modifyIntent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing intent', (done) => {
        try {
          a.modifyIntent(null, null, (data, error) => {
            try {
              const displayE = 'intent is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-modifyIntent', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.modifyIntent('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-modifyIntent', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteIntent - errors', () => {
      it('should have a deleteIntent function', (done) => {
        try {
          assert.equal(true, typeof a.deleteIntent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing intent', (done) => {
        try {
          a.deleteIntent(null, (data, error) => {
            try {
              const displayE = 'intent is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteIntent', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getZTPListFromDeviceAdministrator - errors', () => {
      it('should have a getZTPListFromDeviceAdministrator function', (done) => {
        try {
          assert.equal(true, typeof a.getZTPListFromDeviceAdministrator === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#devAdminCreateAutodiscoveryNe - errors', () => {
      it('should have a devAdminCreateAutodiscoveryNe function', (done) => {
        try {
          assert.equal(true, typeof a.devAdminCreateAutodiscoveryNe === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.devAdminCreateAutodiscoveryNe(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-devAdminCreateAutodiscoveryNe', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#devAdminUpdateAutodiscoveryNe - errors', () => {
      it('should have a devAdminUpdateAutodiscoveryNe function', (done) => {
        try {
          assert.equal(true, typeof a.devAdminUpdateAutodiscoveryNe === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing autodiscoveryNe', (done) => {
        try {
          a.devAdminUpdateAutodiscoveryNe(null, null, (data, error) => {
            try {
              const displayE = 'autodiscoveryNe is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-devAdminUpdateAutodiscoveryNe', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.devAdminUpdateAutodiscoveryNe('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-devAdminUpdateAutodiscoveryNe', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#devAdminDeleteAutodiscoverNe - errors', () => {
      it('should have a devAdminDeleteAutodiscoverNe function', (done) => {
        try {
          assert.equal(true, typeof a.devAdminDeleteAutodiscoverNe === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing autodiscoveryNe', (done) => {
        try {
          a.devAdminDeleteAutodiscoverNe(null, (data, error) => {
            try {
              const displayE = 'autodiscoveryNe is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-devAdminDeleteAutodiscoverNe', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createIPv4AddressPool - errors', () => {
      it('should have a createIPv4AddressPool function', (done) => {
        try {
          assert.equal(true, typeof a.createIPv4AddressPool === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createIPv4AddressPool(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createIPv4AddressPool', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIPv4AddressPool - errors', () => {
      it('should have a getIPv4AddressPool function', (done) => {
        try {
          assert.equal(true, typeof a.getIPv4AddressPool === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ipResourcePools', (done) => {
        try {
          a.getIPv4AddressPool(null, (data, error) => {
            try {
              const displayE = 'ipResourcePools is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getIPv4AddressPool', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#obtainValueFromPool - errors', () => {
      it('should have a obtainValueFromPool function', (done) => {
        try {
          assert.equal(true, typeof a.obtainValueFromPool === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ipResourcePools', (done) => {
        try {
          a.obtainValueFromPool(null, null, (data, error) => {
            try {
              const displayE = 'ipResourcePools is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-obtainValueFromPool', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.obtainValueFromPool('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-obtainValueFromPool', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#nspInventoryFindWithFilter - errors', () => {
      it('should have a nspInventoryFindWithFilter function', (done) => {
        try {
          assert.equal(true, typeof a.nspInventoryFindWithFilter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.nspInventoryFindWithFilter(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-nspInventoryFindWithFilter', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveResyncPolicy - errors', () => {
      it('should have a retrieveResyncPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveResyncPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveResyncPolicyNEAndVersionSpecific - errors', () => {
      it('should have a retrieveResyncPolicyNEAndVersionSpecific function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveResyncPolicyNEAndVersionSpecific === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing resyncPolicy', (done) => {
        try {
          a.retrieveResyncPolicyNEAndVersionSpecific(null, null, null, (data, error) => {
            try {
              const displayE = 'resyncPolicy is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPolicyNEAndVersionSpecific', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveResyncPolicyNEAndVersionSpecific('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPolicyNEAndVersionSpecific', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing version', (done) => {
        try {
          a.retrieveResyncPolicyNEAndVersionSpecific('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'version is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPolicyNEAndVersionSpecific', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#retrieveResyncPollingPolicyNESpecific - errors', () => {
      it('should have a retrieveResyncPollingPolicyNESpecific function', (done) => {
        try {
          assert.equal(true, typeof a.retrieveResyncPollingPolicyNESpecific === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing resyncPolicy', (done) => {
        try {
          a.retrieveResyncPollingPolicyNESpecific(null, null, (data, error) => {
            try {
              const displayE = 'resyncPolicy is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPollingPolicyNESpecific', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.retrieveResyncPollingPolicyNESpecific('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-retrieveResyncPollingPolicyNESpecific', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#enableResyncPollingPolicy - errors', () => {
      it('should have a enableResyncPollingPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.enableResyncPollingPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing resyncPolicy', (done) => {
        try {
          a.enableResyncPollingPolicy(null, null, null, null, null, (data, error) => {
            try {
              const displayE = 'resyncPolicy is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-enableResyncPollingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.enableResyncPollingPolicy('fakeparam', null, null, null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-enableResyncPollingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing version', (done) => {
        try {
          a.enableResyncPollingPolicy('fakeparam', 'fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'version is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-enableResyncPollingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing entity', (done) => {
        try {
          a.enableResyncPollingPolicy('fakeparam', 'fakeparam', 'fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'entity is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-enableResyncPollingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.enableResyncPollingPolicy('fakeparam', 'fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-enableResyncPollingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getL2TopologyLinks - errors', () => {
      it('should have a getL2TopologyLinks function', (done) => {
        try {
          assert.equal(true, typeof a.getL2TopologyLinks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getL2TopologyLinks(null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getL2TopologyLinks', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getL2TopologyAttributes - errors', () => {
      it('should have a getL2TopologyAttributes function', (done) => {
        try {
          assert.equal(true, typeof a.getL2TopologyAttributes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getL2TopologyAttributes(null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getL2TopologyAttributes', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getL2TopologyNodeTerminationPoints - errors', () => {
      it('should have a getL2TopologyNodeTerminationPoints function', (done) => {
        try {
          assert.equal(true, typeof a.getL2TopologyNodeTerminationPoints === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getL2TopologyNodeTerminationPoints(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getL2TopologyNodeTerminationPoints', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.getL2TopologyNodeTerminationPoints('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getL2TopologyNodeTerminationPoints', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNetwork - errors', () => {
      it('should have a getSpecificNetwork function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNetwork === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSpecificNetwork(null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNetwork', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSupportingNetwork - errors', () => {
      it('should have a getSupportingNetwork function', (done) => {
        try {
          assert.equal(true, typeof a.getSupportingNetwork === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSupportingNetwork(null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSupportingNetwork', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkType - errors', () => {
      it('should have a getNetworkType function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkType === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getNetworkType(null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getNetworkType', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetwork - errors', () => {
      it('should have a getNetwork function', (done) => {
        try {
          assert.equal(true, typeof a.getNetwork === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getL3TopologyAttribute - errors', () => {
      it('should have a getL3TopologyAttribute function', (done) => {
        try {
          assert.equal(true, typeof a.getL3TopologyAttribute === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getL3TopologyAttribute(null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getL3TopologyAttribute', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllNodesInANetwork - errors', () => {
      it('should have a getAllNodesInANetwork function', (done) => {
        try {
          assert.equal(true, typeof a.getAllNodesInANetwork === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getAllNodesInANetwork(null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getAllNodesInANetwork', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNodeInANetwork - errors', () => {
      it('should have a getSpecificNodeInANetwork function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNodeInANetwork === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSpecificNodeInANetwork(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNodeInANetwork', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.getSpecificNodeInANetwork('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNodeInANetwork', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificLinkInANetwork - errors', () => {
      it('should have a getSpecificLinkInANetwork function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificLinkInANetwork === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSpecificLinkInANetwork(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificLinkInANetwork', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing link', (done) => {
        try {
          a.getSpecificLinkInANetwork('fakeparam', null, (data, error) => {
            try {
              const displayE = 'link is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificLinkInANetwork', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSupportingLink - errors', () => {
      it('should have a getSupportingLink function', (done) => {
        try {
          assert.equal(true, typeof a.getSupportingLink === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSupportingLink(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSupportingLink', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing link', (done) => {
        try {
          a.getSupportingLink('fakeparam', null, (data, error) => {
            try {
              const displayE = 'link is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSupportingLink', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificTerminationPointsOfANode - errors', () => {
      it('should have a getSpecificTerminationPointsOfANode function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificTerminationPointsOfANode === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSpecificTerminationPointsOfANode(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificTerminationPointsOfANode', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.getSpecificTerminationPointsOfANode('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificTerminationPointsOfANode', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing terminationPoint', (done) => {
        try {
          a.getSpecificTerminationPointsOfANode('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'terminationPoint is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificTerminationPointsOfANode', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSupportingTerminationPoint - errors', () => {
      it('should have a getSupportingTerminationPoint function', (done) => {
        try {
          assert.equal(true, typeof a.getSupportingTerminationPoint === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSupportingTerminationPoint(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSupportingTerminationPoint', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.getSupportingTerminationPoint('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSupportingTerminationPoint', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing terminationPoint', (done) => {
        try {
          a.getSupportingTerminationPoint('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'terminationPoint is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSupportingTerminationPoint', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#l3GETSRTopologyNodeAttributes - errors', () => {
      it('should have a l3GETSRTopologyNodeAttributes function', (done) => {
        try {
          assert.equal(true, typeof a.l3GETSRTopologyNodeAttributes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.l3GETSRTopologyNodeAttributes(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-l3GETSRTopologyNodeAttributes', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.l3GETSRTopologyNodeAttributes('fakeparam', null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-l3GETSRTopologyNodeAttributes', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#l3GETSRTopologyLinkAttributes - errors', () => {
      it('should have a l3GETSRTopologyLinkAttributes function', (done) => {
        try {
          assert.equal(true, typeof a.l3GETSRTopologyLinkAttributes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.l3GETSRTopologyLinkAttributes(null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-l3GETSRTopologyLinkAttributes', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing link', (done) => {
        try {
          a.l3GETSRTopologyLinkAttributes('fakeparam', null, (data, error) => {
            try {
              const displayE = 'link is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-l3GETSRTopologyLinkAttributes', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSAPNetwork - errors', () => {
      it('should have a getSAPNetwork function', (done) => {
        try {
          assert.equal(true, typeof a.getSAPNetwork === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIETFNetworkFromSpecificNode - errors', () => {
      it('should have a getIETFNetworkFromSpecificNode function', (done) => {
        try {
          assert.equal(true, typeof a.getIETFNetworkFromSpecificNode === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.getIETFNetworkFromSpecificNode(null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getIETFNetworkFromSpecificNode', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSAPsOnASpecificNodeOfSpecificServiceType - errors', () => {
      it('should have a getSAPsOnASpecificNodeOfSpecificServiceType function', (done) => {
        try {
          assert.equal(true, typeof a.getSAPsOnASpecificNodeOfSpecificServiceType === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing network', (done) => {
        try {
          a.getSAPsOnASpecificNodeOfSpecificServiceType(null, null, null, (data, error) => {
            try {
              const displayE = 'network is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSAPsOnASpecificNodeOfSpecificServiceType', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing node', (done) => {
        try {
          a.getSAPsOnASpecificNodeOfSpecificServiceType('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'node is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSAPsOnASpecificNodeOfSpecificServiceType', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing service', (done) => {
        try {
          a.getSAPsOnASpecificNodeOfSpecificServiceType('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'service is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSAPsOnASpecificNodeOfSpecificServiceType', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIETFMappingFiles - errors', () => {
      it('should have a getIETFMappingFiles function', (done) => {
        try {
          assert.equal(true, typeof a.getIETFMappingFiles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#loadIETFMappingFiles - errors', () => {
      it('should have a loadIETFMappingFiles function', (done) => {
        try {
          assert.equal(true, typeof a.loadIETFMappingFiles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing nspPluginId', (done) => {
        try {
          a.loadIETFMappingFiles(null, null, (data, error) => {
            try {
              const displayE = 'nspPluginId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-loadIETFMappingFiles', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing file', (done) => {
        try {
          a.loadIETFMappingFiles('fakeparam', null, (data, error) => {
            try {
              const displayE = 'file is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-loadIETFMappingFiles', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createMappingPolicy - errors', () => {
      it('should have a createMappingPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.createMappingPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createMappingPolicy(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createMappingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCorrelationPolicy - errors', () => {
      it('should have a getCorrelationPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.getCorrelationPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateMappingPolicy - errors', () => {
      it('should have a updateMappingPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.updateMappingPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing routerNeMapping', (done) => {
        try {
          a.updateMappingPolicy(null, null, (data, error) => {
            try {
              const displayE = 'routerNeMapping is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateMappingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateMappingPolicy('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateMappingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificMappingPolicy - errors', () => {
      it('should have a getSpecificMappingPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificMappingPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing routerNeMapping', (done) => {
        try {
          a.getSpecificMappingPolicy(null, (data, error) => {
            try {
              const displayE = 'routerNeMapping is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificMappingPolicy', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAllPoliciesOnARouter - errors', () => {
      it('should have a deleteAllPoliciesOnARouter function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAllPoliciesOnARouter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing routerNeMapping', (done) => {
        try {
          a.deleteAllPoliciesOnARouter(null, (data, error) => {
            try {
              const displayE = 'routerNeMapping is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteAllPoliciesOnARouter', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRouterNeMapping - errors', () => {
      it('should have a getRouterNeMapping function', (done) => {
        try {
          assert.equal(true, typeof a.getRouterNeMapping === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteOnePolicyOfRouter - errors', () => {
      it('should have a deleteOnePolicyOfRouter function', (done) => {
        try {
          assert.equal(true, typeof a.deleteOnePolicyOfRouter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing routerNeMapping', (done) => {
        try {
          a.deleteOnePolicyOfRouter(null, null, (data, error) => {
            try {
              const displayE = 'routerNeMapping is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteOnePolicyOfRouter', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing routerInfos', (done) => {
        try {
          a.deleteOnePolicyOfRouter('fakeparam', null, (data, error) => {
            try {
              const displayE = 'routerInfos is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteOnePolicyOfRouter', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorAgeoutPolicySettings - errors', () => {
      it('should have a getIndicatorAgeoutPolicySettings function', (done) => {
        try {
          assert.equal(true, typeof a.getIndicatorAgeoutPolicySettings === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateTheRetentionTimeForIndicators - errors', () => {
      it('should have a updateTheRetentionTimeForIndicators function', (done) => {
        try {
          assert.equal(true, typeof a.updateTheRetentionTimeForIndicators === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateTheRetentionTimeForIndicators(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateTheRetentionTimeForIndicators', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getBaselineAgeoutPolicySettings - errors', () => {
      it('should have a getBaselineAgeoutPolicySettings function', (done) => {
        try {
          assert.equal(true, typeof a.getBaselineAgeoutPolicySettings === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateTheRetentionTimeForBaseline - errors', () => {
      it('should have a updateTheRetentionTimeForBaseline function', (done) => {
        try {
          assert.equal(true, typeof a.updateTheRetentionTimeForBaseline === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateTheRetentionTimeForBaseline(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateTheRetentionTimeForBaseline', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#avgCPUAllNodesAllActions - errors', () => {
      it('should have a avgCPUAllNodesAllActions function', (done) => {
        try {
          assert.equal(true, typeof a.avgCPUAllNodesAllActions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.avgCPUAllNodesAllActions(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-avgCPUAllNodesAllActions', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllIndicatorTemplates - errors', () => {
      it('should have a getAllIndicatorTemplates function', (done) => {
        try {
          assert.equal(true, typeof a.getAllIndicatorTemplates === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#uPDATEIndicatorTemplate - errors', () => {
      it('should have a uPDATEIndicatorTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.uPDATEIndicatorTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.uPDATEIndicatorTemplate(null, null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-uPDATEIndicatorTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.uPDATEIndicatorTemplate('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-uPDATEIndicatorTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteIndicatorTemplate - errors', () => {
      it('should have a deleteIndicatorTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.deleteIndicatorTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.deleteIndicatorTemplate(null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteIndicatorTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificIndicatorTemplate - errors', () => {
      it('should have a getSpecificIndicatorTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificIndicatorTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.getSpecificIndicatorTemplate(null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificIndicatorTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#postavgCPUAllNodesAllActions - errors', () => {
      it('should have a postavgCPUAllNodesAllActions function', (done) => {
        try {
          assert.equal(true, typeof a.postavgCPUAllNodesAllActions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.postavgCPUAllNodesAllActions(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-postavgCPUAllNodesAllActions', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllIndicatorRules - errors', () => {
      it('should have a getAllIndicatorRules function', (done) => {
        try {
          assert.equal(true, typeof a.getAllIndicatorRules === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateIndicatorRule - errors', () => {
      it('should have a updateIndicatorRule function', (done) => {
        try {
          assert.equal(true, typeof a.updateIndicatorRule === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing rule', (done) => {
        try {
          a.updateIndicatorRule(null, null, (data, error) => {
            try {
              const displayE = 'rule is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateIndicatorRule', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateIndicatorRule('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateIndicatorRule', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteIndicatorRule - errors', () => {
      it('should have a deleteIndicatorRule function', (done) => {
        try {
          assert.equal(true, typeof a.deleteIndicatorRule === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing rule', (done) => {
        try {
          a.deleteIndicatorRule(null, (data, error) => {
            try {
              const displayE = 'rule is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteIndicatorRule', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificIndicatorRule - errors', () => {
      it('should have a getSpecificIndicatorRule function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificIndicatorRule === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing rule', (done) => {
        try {
          a.getSpecificIndicatorRule(null, (data, error) => {
            try {
              const displayE = 'rule is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificIndicatorRule', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createSubscription - errors', () => {
      it('should have a createSubscription function', (done) => {
        try {
          assert.equal(true, typeof a.createSubscription === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createSubscription(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createSubscription', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createBaseline - errors', () => {
      it('should have a createBaseline function', (done) => {
        try {
          assert.equal(true, typeof a.createBaseline === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createBaseline(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createBaseline', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getBaseline - errors', () => {
      it('should have a getBaseline function', (done) => {
        try {
          assert.equal(true, typeof a.getBaseline === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baseline', (done) => {
        try {
          a.getBaseline(null, (data, error) => {
            try {
              const displayE = 'baseline is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getBaseline', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createBaselineDetector - errors', () => {
      it('should have a createBaselineDetector function', (done) => {
        try {
          assert.equal(true, typeof a.createBaselineDetector === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baseline', (done) => {
        try {
          a.createBaselineDetector(null, null, (data, error) => {
            try {
              const displayE = 'baseline is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createBaselineDetector('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteBaseline - errors', () => {
      it('should have a deleteBaseline function', (done) => {
        try {
          assert.equal(true, typeof a.deleteBaseline === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baseline', (done) => {
        try {
          a.deleteBaseline(null, (data, error) => {
            try {
              const displayE = 'baseline is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteBaseline', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getBaselineDetector - errors', () => {
      it('should have a getBaselineDetector function', (done) => {
        try {
          assert.equal(true, typeof a.getBaselineDetector === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baseline', (done) => {
        try {
          a.getBaselineDetector(null, null, (data, error) => {
            try {
              const displayE = 'baseline is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baselineDetector', (done) => {
        try {
          a.getBaselineDetector('fakeparam', null, (data, error) => {
            try {
              const displayE = 'baselineDetector is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#patchBaselineDetector - errors', () => {
      it('should have a patchBaselineDetector function', (done) => {
        try {
          assert.equal(true, typeof a.patchBaselineDetector === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baseline', (done) => {
        try {
          a.patchBaselineDetector(null, null, null, (data, error) => {
            try {
              const displayE = 'baseline is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-patchBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baselineDetector', (done) => {
        try {
          a.patchBaselineDetector('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'baselineDetector is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-patchBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.patchBaselineDetector('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-patchBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteBaselineDetector - errors', () => {
      it('should have a deleteBaselineDetector function', (done) => {
        try {
          assert.equal(true, typeof a.deleteBaselineDetector === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baseline', (done) => {
        try {
          a.deleteBaselineDetector(null, null, (data, error) => {
            try {
              const displayE = 'baseline is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing baselineDetector', (done) => {
        try {
          a.deleteBaselineDetector('fakeparam', null, (data, error) => {
            try {
              const displayE = 'baselineDetector is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteBaselineDetector', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteSubscription - errors', () => {
      it('should have a deleteSubscription function', (done) => {
        try {
          assert.equal(true, typeof a.deleteSubscription === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subscription', (done) => {
        try {
          a.deleteSubscription(null, (data, error) => {
            try {
              const displayE = 'subscription is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteSubscription', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllBaselines - errors', () => {
      it('should have a getAllBaselines function', (done) => {
        try {
          assert.equal(true, typeof a.getAllBaselines === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#importIntentTypeFromIntentManager - errors', () => {
      it('should have a importIntentTypeFromIntentManager function', (done) => {
        try {
          assert.equal(true, typeof a.importIntentTypeFromIntentManager === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.importIntentTypeFromIntentManager(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-importIntentTypeFromIntentManager', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIntentTypes - errors', () => {
      it('should have a getIntentTypes function', (done) => {
        try {
          assert.equal(true, typeof a.getIntentTypes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#removeIntentType - errors', () => {
      it('should have a removeIntentType function', (done) => {
        try {
          assert.equal(true, typeof a.removeIntentType === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.removeIntentType(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-removeIntentType', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createTemplate - errors', () => {
      it('should have a createTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.createTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createTemplate(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTemplates - errors', () => {
      it('should have a getTemplates function', (done) => {
        try {
          assert.equal(true, typeof a.getTemplates === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateTemplateLifecycle - errors', () => {
      it('should have a updateTemplateLifecycle function', (done) => {
        try {
          assert.equal(true, typeof a.updateTemplateLifecycle === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.updateTemplateLifecycle(null, null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateTemplateLifecycle', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateTemplateLifecycle('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateTemplateLifecycle', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteTemplate - errors', () => {
      it('should have a deleteTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.deleteTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.deleteTemplate(null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createPortGroupDirectory - errors', () => {
      it('should have a createPortGroupDirectory function', (done) => {
        try {
          assert.equal(true, typeof a.createPortGroupDirectory === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing category', (done) => {
        try {
          a.createPortGroupDirectory(null, null, (data, error) => {
            try {
              const displayE = 'category is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createPortGroupDirectory', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createPortGroupDirectory('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createPortGroupDirectory', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createPortGroup - errors', () => {
      it('should have a createPortGroup function', (done) => {
        try {
          assert.equal(true, typeof a.createPortGroup === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing category', (done) => {
        try {
          a.createPortGroup(null, null, (data, error) => {
            try {
              const displayE = 'category is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createPortGroup', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createPortGroup('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createPortGroup', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPortGroupFDN - errors', () => {
      it('should have a getPortGroupFDN function', (done) => {
        try {
          assert.equal(true, typeof a.getPortGroupFDN === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing category', (done) => {
        try {
          a.getPortGroupFDN(null, (data, error) => {
            try {
              const displayE = 'category is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getPortGroupFDN', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createDeployment - errors', () => {
      it('should have a createDeployment function', (done) => {
        try {
          assert.equal(true, typeof a.createDeployment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createDeployment(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-createDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateDeploymentConfiguration - errors', () => {
      it('should have a updateDeploymentConfiguration function', (done) => {
        try {
          assert.equal(true, typeof a.updateDeploymentConfiguration === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateDeploymentConfiguration(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-updateDeploymentConfiguration', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#replaceDeployment - errors', () => {
      it('should have a replaceDeployment function', (done) => {
        try {
          assert.equal(true, typeof a.replaceDeployment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.replaceDeployment(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-replaceDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDeployments - errors', () => {
      it('should have a getDeployments function', (done) => {
        try {
          assert.equal(true, typeof a.getDeployments === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificDeployment - errors', () => {
      it('should have a getSpecificDeployment function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificDeployment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deployment', (done) => {
        try {
          a.getSpecificDeployment(null, (data, error) => {
            try {
              const displayE = 'deployment is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteSingleDeployment - errors', () => {
      it('should have a deleteSingleDeployment function', (done) => {
        try {
          assert.equal(true, typeof a.deleteSingleDeployment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deployment', (done) => {
        try {
          a.deleteSingleDeployment(null, (data, error) => {
            try {
              const displayE = 'deployment is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteSingleDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteDeployments - errors', () => {
      it('should have a deleteDeployments function', (done) => {
        try {
          assert.equal(true, typeof a.deleteDeployments === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.deleteDeployments(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-deleteDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#discoverDeployments - errors', () => {
      it('should have a discoverDeployments function', (done) => {
        try {
          assert.equal(true, typeof a.discoverDeployments === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.discoverDeployments(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-discoverDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#auditDeployment - errors', () => {
      it('should have a auditDeployment function', (done) => {
        try {
          assert.equal(true, typeof a.auditDeployment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deployment', (done) => {
        try {
          a.auditDeployment(null, null, (data, error) => {
            try {
              const displayE = 'deployment is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-auditDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.auditDeployment('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-auditDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAuditDetails - errors', () => {
      it('should have a getAuditDetails function', (done) => {
        try {
          assert.equal(true, typeof a.getAuditDetails === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deployment', (done) => {
        try {
          a.getAuditDetails(null, (data, error) => {
            try {
              const displayE = 'deployment is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getAuditDetails', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#alignConfigurationDeployment - errors', () => {
      it('should have a alignConfigurationDeployment function', (done) => {
        try {
          assert.equal(true, typeof a.alignConfigurationDeployment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deployment', (done) => {
        try {
          a.alignConfigurationDeployment(null, null, (data, error) => {
            try {
              const displayE = 'deployment is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-alignConfigurationDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.alignConfigurationDeployment('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-alignConfigurationDeployment', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#auditTemplate - errors', () => {
      it('should have a auditTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.auditTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.auditTemplate(null, null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-auditTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.auditTemplate('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-auditTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#checkAuditStatusCount - errors', () => {
      it('should have a checkAuditStatusCount function', (done) => {
        try {
          assert.equal(true, typeof a.checkAuditStatusCount === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.checkAuditStatusCount(null, null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-checkAuditStatusCount', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.checkAuditStatusCount('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-checkAuditStatusCount', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#alignConfigurationTemplateAllDeployments - errors', () => {
      it('should have a alignConfigurationTemplateAllDeployments function', (done) => {
        try {
          assert.equal(true, typeof a.alignConfigurationTemplateAllDeployments === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.alignConfigurationTemplateAllDeployments(null, null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-alignConfigurationTemplateAllDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.alignConfigurationTemplateAllDeployments('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-alignConfigurationTemplateAllDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#alignConfigurationTemplateMisalignedDeployments - errors', () => {
      it('should have a alignConfigurationTemplateMisalignedDeployments function', (done) => {
        try {
          assert.equal(true, typeof a.alignConfigurationTemplateMisalignedDeployments === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing template', (done) => {
        try {
          a.alignConfigurationTemplateMisalignedDeployments(null, null, (data, error) => {
            try {
              const displayE = 'template is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-alignConfigurationTemplateMisalignedDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.alignConfigurationTemplateMisalignedDeployments('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-alignConfigurationTemplateMisalignedDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#auditNodeDeployments - errors', () => {
      it('should have a auditNodeDeployments function', (done) => {
        try {
          assert.equal(true, typeof a.auditNodeDeployments === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.auditNodeDeployments(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-auditNodeDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#cloneTemplate - errors', () => {
      it('should have a cloneTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.cloneTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.cloneTemplate(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-cloneTemplate', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#migrateDeployments - errors', () => {
      it('should have a migrateDeployments function', (done) => {
        try {
          assert.equal(true, typeof a.migrateDeployments === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.migrateDeployments(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-migrateDeployments', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNE - errors', () => {
      it('should have a getNE function', (done) => {
        try {
          assert.equal(true, typeof a.getNE === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNE - errors', () => {
      it('should have a getSpecificNE function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNE === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing networkElement', (done) => {
        try {
          a.getSpecificNE(null, null, (data, error) => {
            try {
              const displayE = 'networkElement is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNE', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getShelf - errors', () => {
      it('should have a getShelf function', (done) => {
        try {
          assert.equal(true, typeof a.getShelf === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificShelf - errors', () => {
      it('should have a getSpecificShelf function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificShelf === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing networkElement', (done) => {
        try {
          a.getSpecificShelf(null, null, (data, error) => {
            try {
              const displayE = 'networkElement is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificShelf', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing shelf', (done) => {
        try {
          a.getSpecificShelf('fakeparam', null, (data, error) => {
            try {
              const displayE = 'shelf is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificShelf', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCard - errors', () => {
      it('should have a getCard function', (done) => {
        try {
          assert.equal(true, typeof a.getCard === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNECards - errors', () => {
      it('should have a getSpecificNECards function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNECards === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing networkElement', (done) => {
        try {
          a.getSpecificNECards(null, null, (data, error) => {
            try {
              const displayE = 'networkElement is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNECards', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing card', (done) => {
        try {
          a.getSpecificNECards('fakeparam', null, (data, error) => {
            try {
              const displayE = 'card is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNECards', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPort - errors', () => {
      it('should have a getPort function', (done) => {
        try {
          assert.equal(true, typeof a.getPort === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPortFromSpecificNE - errors', () => {
      it('should have a getPortFromSpecificNE function', (done) => {
        try {
          assert.equal(true, typeof a.getPortFromSpecificNE === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing networkElement', (done) => {
        try {
          a.getPortFromSpecificNE(null, null, (data, error) => {
            try {
              const displayE = 'networkElement is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getPortFromSpecificNE', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing port', (done) => {
        try {
          a.getPortFromSpecificNE('fakeparam', null, (data, error) => {
            try {
              const displayE = 'port is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getPortFromSpecificNE', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPortFromSpecificNETransceiverDetails - errors', () => {
      it('should have a getPortFromSpecificNETransceiverDetails function', (done) => {
        try {
          assert.equal(true, typeof a.getPortFromSpecificNETransceiverDetails === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing networkElement', (done) => {
        try {
          a.getPortFromSpecificNETransceiverDetails(null, null, (data, error) => {
            try {
              const displayE = 'networkElement is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getPortFromSpecificNETransceiverDetails', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing port', (done) => {
        try {
          a.getPortFromSpecificNETransceiverDetails('fakeparam', null, (data, error) => {
            try {
              const displayE = 'port is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getPortFromSpecificNETransceiverDetails', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLags - errors', () => {
      it('should have a getLags function', (done) => {
        try {
          assert.equal(true, typeof a.getLags === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNELag - errors', () => {
      it('should have a getSpecificNELag function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNELag === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing networkElement', (done) => {
        try {
          a.getSpecificNELag(null, (data, error) => {
            try {
              const displayE = 'networkElement is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNELag', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNELagWithFields - errors', () => {
      it('should have a getSpecificNELagWithFields function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNELagWithFields === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing fields', (done) => {
        try {
          a.getSpecificNELagWithFields(null, null, null, (data, error) => {
            try {
              const displayE = 'fields is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNELagWithFields', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing networkElement', (done) => {
        try {
          a.getSpecificNELagWithFields('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'networkElement is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNELagWithFields', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing lag', (done) => {
        try {
          a.getSpecificNELagWithFields('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'lag is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-nokia_nsp_network_management-adapter-getSpecificNELagWithFields', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRadio - errors', () => {
      it('should have a getRadio function', (done) => {
        try {
          assert.equal(true, typeof a.getRadio === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });
  });
});
