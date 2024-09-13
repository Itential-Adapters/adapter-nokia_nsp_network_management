/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint no-unused-vars: warn */
/* eslint no-underscore-dangle: warn  */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');
const mocha = require('mocha');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');

const anything = td.matchers.anything();

// stub and attemptTimeout are used throughout the code so set them here
let logLevel = 'none';
const isRapidFail = false;
const isSaveMockData = false;

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

// uncomment if connecting
// samProps.host = 'replace.hostorip.here';
// samProps.authentication.username = 'username';
// samProps.authentication.password = 'password';
// samProps.authentication.token = 'password';
// samProps.protocol = 'http';
// samProps.port = 80;
// samProps.ssl.enabled = false;
// samProps.ssl.accept_invalid_cert = false;

if (samProps.request.attempt_timeout < 30000) {
  samProps.request.attempt_timeout = 30000;
}
samProps.devicebroker.enabled = true;
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
 * Runs the common asserts for test
 */
function runCommonAsserts(data, error) {
  assert.equal(undefined, error);
  assert.notEqual(undefined, data);
  assert.notEqual(null, data);
  assert.notEqual(undefined, data.response);
  assert.notEqual(null, data.response);
}

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

/**
 * @function saveMockData
 * Attempts to take data from responses and place them in MockDataFiles to help create Mockdata.
 * Note, this was built based on entity file structure for Adapter-Engine 1.6.x
 * @param {string} entityName - Name of the entity saving mock data for
 * @param {string} actionName -  Name of the action saving mock data for
 * @param {string} descriptor -  Something to describe this test (used as a type)
 * @param {string or object} responseData - The data to put in the mock file.
 */
function saveMockData(entityName, actionName, descriptor, responseData) {
  // do not need to save mockdata if we are running in stub mode (already has mock data) or if told not to save
  if (stub || !isSaveMockData) {
    return false;
  }

  // must have a response in order to store the response
  if (responseData && responseData.response) {
    let data = responseData.response;

    // if there was a raw response that one is better as it is untranslated
    if (responseData.raw) {
      data = responseData.raw;

      try {
        const temp = JSON.parse(data);
        data = temp;
      } catch (pex) {
        // do not care if it did not parse as we will just use data
      }
    }

    try {
      const base = path.join(__dirname, `../../entities/${entityName}/`);
      const mockdatafolder = 'mockdatafiles';
      const filename = `mockdatafiles/${actionName}-${descriptor}.json`;

      if (!fs.existsSync(base + mockdatafolder)) {
        fs.mkdirSync(base + mockdatafolder);
      }

      // write the data we retrieved
      fs.writeFile(base + filename, JSON.stringify(data, null, 2), 'utf8', (errWritingMock) => {
        if (errWritingMock) throw errWritingMock;

        // update the action file to reflect the changes. Note: We're replacing the default object for now!
        fs.readFile(`${base}action.json`, (errRead, content) => {
          if (errRead) throw errRead;

          // parse the action file into JSON
          const parsedJson = JSON.parse(content);

          // The object update we'll write in.
          const responseObj = {
            type: descriptor,
            key: '',
            mockFile: filename
          };

          // get the object for method we're trying to change.
          const currentMethodAction = parsedJson.actions.find((obj) => obj.name === actionName);

          // if the method was not found - should never happen but...
          if (!currentMethodAction) {
            throw Error('Can\'t find an action for this method in the provided entity.');
          }

          // if there is a response object, we want to replace the Response object. Otherwise we'll create one.
          const actionResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === descriptor);

          // Add the action responseObj back into the array of response objects.
          if (!actionResponseObj) {
            // if there is a default response object, we want to get the key.
            const defaultResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === 'default');

            // save the default key into the new response object
            if (defaultResponseObj) {
              responseObj.key = defaultResponseObj.key;
            }

            // save the new response object
            currentMethodAction.responseObjects = [responseObj];
          } else {
            // update the location of the mock data file
            actionResponseObj.mockFile = responseObj.mockFile;
          }

          // Save results
          fs.writeFile(`${base}action.json`, JSON.stringify(parsedJson, null, 2), (err) => {
            if (err) throw err;
          });
        });
      });
    } catch (e) {
      log.debug(`Failed to save mock data for ${actionName}. ${e.message}`);
      return false;
    }
  }

  // no response to save
  log.debug(`No data passed to save into mockdata for ${actionName}`);
  return false;
}

// require the adapter that we are going to be using
const NokiaNspNetworkManagement = require('../../adapter');

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[integration] nokia_nsp_network_management Adapter Test', () => {
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

    describe('#connect', () => {
      it('should get connected - no healthcheck', (done) => {
        try {
          a.healthcheckType = 'none';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
      it('should get connected - startup healthcheck', (done) => {
        try {
          a.healthcheckType = 'startup';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should be healthy', (done) => {
        try {
          a.healthCheck(null, (data) => {
            try {
              assert.equal(true, a.healthy);
              saveMockData('system', 'healthcheck', 'default', data);
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

    // broker tests
    describe('#getDevicesFiltered - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          const opts = {
            filter: {
              name: 'deviceName'
            }
          };
          a.getDevicesFiltered(opts, (data, error) => {
            try {
              if (stub) {
                if (samProps.devicebroker.getDevicesFiltered[0].handleFailure === 'ignore') {
                  assert.equal(null, error);
                  assert.notEqual(undefined, data);
                  assert.notEqual(null, data);
                  assert.equal(0, data.total);
                  assert.equal(0, data.list.length);
                } else {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
                }
              } else {
                runCommonAsserts(data, error);
              }
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

    describe('#iapGetDeviceCount - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          const opts = {
            filter: {
              name: 'deviceName'
            }
          };
          a.iapGetDeviceCount((data, error) => {
            try {
              if (stub) {
                if (samProps.devicebroker.getDevicesFiltered[0].handleFailure === 'ignore') {
                  assert.equal(null, error);
                  assert.notEqual(undefined, data);
                  assert.notEqual(null, data);
                  assert.equal(0, data.count);
                } else {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
                }
              } else {
                runCommonAsserts(data, error);
              }
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

    // exposed cache tests
    describe('#iapPopulateEntityCache - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.iapPopulateEntityCache('Device', (data, error) => {
            try {
              if (stub) {
                assert.equal(null, data);
                assert.notEqual(undefined, error);
                assert.notEqual(null, error);
                done();
              } else {
                assert.equal(undefined, error);
                assert.equal('success', data[0]);
                done();
              }
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

    describe('#iapRetrieveEntitiesCache - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.iapRetrieveEntitiesCache('Device', {}, (data, error) => {
            try {
              if (stub) {
                assert.equal(null, data);
                assert.notEqual(null, error);
                assert.notEqual(undefined, error);
              } else {
                assert.equal(undefined, error);
                assert.notEqual(null, data);
                assert.notEqual(undefined, data);
              }
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
    /*
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    *** All code above this comment will be replaced during a migration ***
    ******************* DO NOT REMOVE THIS COMMENT BLOCK ******************
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    */

    const iETFLogicalInventoryRestconfAPINetwork = 'fakedata';
    const iETFLogicalInventoryRestconfAPINode = 'fakedata';
    describe('#retrieveNetworkInterfaces - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.retrieveNetworkInterfaces(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfaces', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveNetworkInterfacesConfig(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['openconfig-interfaces:config']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfacesConfig', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.retrieveNetworkSubInterfaces(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfaces', 'default', data);
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

    const iETFLogicalInventoryRestconfAPISubinterface = 'fakedata';
    describe('#retrieveNetworkSubInterfacesConfig - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveNetworkSubInterfacesConfig(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, iETFLogicalInventoryRestconfAPISubinterface, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['openconfig-interfaces:config']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesConfig', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumbered(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, iETFLogicalInventoryRestconfAPISubinterface, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['openconfig-interfaces:unnumbered']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfacesUnnumbered', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveNetworkInterfacesUnnumberedIntf(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, iETFLogicalInventoryRestconfAPISubinterface, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['openconfig-interfaces:interface-ref']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfacesUnnumberedIntf', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv6Addresses(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, iETFLogicalInventoryRestconfAPISubinterface, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['openconfig-interfaces:address']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesIPv6Addresses', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveNetworkSubInterfacesState(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, iETFLogicalInventoryRestconfAPISubinterface, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['openconfig-interfaces:state']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesState', 'default', data);
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

    const iETFLogicalInventoryRestconfAPIInterfaceParam = 'fakedata';
    describe('#retrieveNetworkSubInterfacesIPv4Addresses - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveNetworkSubInterfacesIPv4Addresses(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, iETFLogicalInventoryRestconfAPIInterfaceParam, iETFLogicalInventoryRestconfAPISubinterface, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['openconfig-interfaces:address']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesIPv4Addresses', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.retrieveNetworkInstance(iETFLogicalInventoryRestconfAPINetwork, iETFLogicalInventoryRestconfAPINode, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInstance', 'default', data);
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

    const iETFLogicalInventoryRestconfAPIResyncPolicy = 'fakedata';
    const iETFLogicalInventoryRestconfAPIVersion = 'fakedata';
    describe('#retrieveResyncPolicyNodeVersionEntity - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveResyncPolicyNodeVersionEntity(iETFLogicalInventoryRestconfAPIResyncPolicy, iETFLogicalInventoryRestconfAPINode, iETFLogicalInventoryRestconfAPIVersion, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-admin-resync:entity']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFLogicalInventoryRestconfAPI', 'retrieveResyncPolicyNodeVersionEntity', 'default', data);
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

    const intentCreateUsingIntentBodyParam = {
      'ibn:intent': {
        target: 'nspuser',
        'intent-type': 'create_http_user',
        'intent-type-version': 1,
        'required-network-state': 'active',
        'ibn:intent-specific-data': {
          'create_http_user:create_http_user': {
            password: samProps.authentication.token,
            passwordConfirm: samProps.authentication.token
          }
        }
      }
    };
    describe('#createUsingIntent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createUsingIntent(intentCreateUsingIntentBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Intent', 'createUsingIntent', 'default', data);
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

    const intentIntent = 'fakedata';
    describe('#synchronizeIntent - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.synchronizeIntent(intentIntent, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response.response);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Intent', 'synchronizeIntent', 'default', data);
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

    const intentModifyIntentBodyParam = {
      'ibn:intent': {
        target: 'TestProfile2',
        'intent-type': 'ztp-profile',
        'intent-type-version': 1,
        'required-network-state': 'active',
        'ibn:intent-specific-data': {
          'ztp-profile:ztp-profile': {
            'node-type': '7250_IXR',
            'md-management-connection': 'out-of-band',
            'dns-domain': 'nokia-new'
          }
        }
      }
    };
    describe('#modifyIntent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.modifyIntent(intentIntent, intentModifyIntentBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Intent', 'modifyIntent', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIntent(intentIntent, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['ibn:intent']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Intent', 'getIntent', 'default', data);
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

    const manageZTPListFromDeviceAdministratorDevAdminCreateAutodiscoveryNeBodyParam = {
      'autodiscovery-ne': [
        {
          'ne-name': 'a1',
          'mgmt-ip': '1.11.11.1',
          'system-ip': '1.11.11.1',
          'serial-number': 'a1',
          'discovery-status': 'pending',
          'mgmt-mode': 'model-driven',
          'ne-type': '7250_IXR',
          'ne-version': '19.10.R7',
          'disc-rule-name': 'ken-rule',
          'ztp-files': 'configfile.conf;',
          'ztp-primary-file': 'provfile.conf;',
          'ztp-profile-name': 'profile',
          'status-details': ''
        }
      ]
    };
    describe('#devAdminCreateAutodiscoveryNe - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.devAdminCreateAutodiscoveryNe(manageZTPListFromDeviceAdministratorDevAdminCreateAutodiscoveryNeBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ManageZTPListFromDeviceAdministrator', 'devAdminCreateAutodiscoveryNe', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getZTPListFromDeviceAdministrator((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-ne-control:autodiscovery-ne']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ManageZTPListFromDeviceAdministrator', 'getZTPListFromDeviceAdministrator', 'default', data);
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

    const manageZTPListFromDeviceAdministratorAutodiscoveryNe = 'fakedata';
    const manageZTPListFromDeviceAdministratorDevAdminUpdateAutodiscoveryNeBodyParam = {
      'autodiscovery-ne': [
        {
          'discovery-status': 'success',
          'discovery-timestamp': 4321
        }
      ]
    };
    describe('#devAdminUpdateAutodiscoveryNe - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.devAdminUpdateAutodiscoveryNe(manageZTPListFromDeviceAdministratorAutodiscoveryNe, manageZTPListFromDeviceAdministratorDevAdminUpdateAutodiscoveryNeBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ManageZTPListFromDeviceAdministrator', 'devAdminUpdateAutodiscoveryNe', 'default', data);
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

    const addressPoolCreateIPv4AddressPoolBodyParam = {
      'nsp-resource-pool:ip-resource-pools': {
        name: 'ip-2',
        scope: 'net-1',
        type: 'nsp-resource-pool-utils:ip-address-prefix',
        description: 'this is a Hosts IP pool',
        'ip-pool-spec': {
          'ip-masks': [
            {
              'ip-mask': '10.0.0.28/31',
              purposes: [
                'default'
              ]
            }
          ]
        }
      }
    };
    describe('#createIPv4AddressPool - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createIPv4AddressPool(addressPoolCreateIPv4AddressPoolBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AddressPool', 'createIPv4AddressPool', 'default', data);
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

    const addressPoolIpResourcePools = 'fakedata';
    const addressPoolObtainValueFromPoolBodyParam = {
      'nsp-resource-pool:input': {
        owner: 'ztp',
        'all-or-nothing': true,
        'total-number-of-resources': 1,
        'allocation-mask': 32
      }
    };
    describe('#obtainValueFromPool - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.obtainValueFromPool(addressPoolIpResourcePools, addressPoolObtainValueFromPoolBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-resource-pool:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AddressPool', 'obtainValueFromPool', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIPv4AddressPool(addressPoolIpResourcePools, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-resource-pool:ip-resource-pools']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AddressPool', 'getIPv4AddressPool', 'default', data);
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

    const logicalInventoryRestconfAPINspInventoryFindWithFilterBodyParam = {
      input: {
        'xpath-filter': '/nsp-network:network/node[node-id=\'92.168.98.156\']/node-root/openconfig-acl:acl/acl-sets/acl-set'
      }
    };
    describe('#nspInventoryFindWithFilter - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.nspInventoryFindWithFilter(logicalInventoryRestconfAPINspInventoryFindWithFilterBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-inventory:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LogicalInventoryRestconfAPI', 'nspInventoryFindWithFilter', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveResyncPolicy((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-admin-resync:resync-policy']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LogicalInventoryRestconfAPI', 'retrieveResyncPolicy', 'default', data);
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

    const logicalInventoryRestconfAPIResyncPolicy = 'fakedata';
    const logicalInventoryRestconfAPINode = 'fakedata';
    describe('#retrieveResyncPollingPolicyNESpecific - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveResyncPollingPolicyNESpecific(logicalInventoryRestconfAPIResyncPolicy, logicalInventoryRestconfAPINode, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-admin-resync:node']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LogicalInventoryRestconfAPI', 'retrieveResyncPollingPolicyNESpecific', 'default', data);
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

    const logicalInventoryRestconfAPIVersion = 'fakedata';
    describe('#retrieveResyncPolicyNEAndVersionSpecific - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.retrieveResyncPolicyNEAndVersionSpecific(logicalInventoryRestconfAPIResyncPolicy, logicalInventoryRestconfAPINode, logicalInventoryRestconfAPIVersion, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-admin-resync:version']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LogicalInventoryRestconfAPI', 'retrieveResyncPolicyNEAndVersionSpecific', 'default', data);
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

    const logicalInventoryRestconfAPIEntity = 'fakedata';
    const logicalInventoryRestconfAPIEnableResyncPollingPolicyBodyParam = {
      entity: [
        {
          'entity-type': 'openconfig-acl:/acl/acl-sets/acl-set/acl-entries/acl-entry',
          period: 2,
          'admin-state': 'enabled',
          description: 'Enable For OpenconfigAcl'
        }
      ]
    };
    describe('#enableResyncPollingPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.enableResyncPollingPolicy(logicalInventoryRestconfAPIResyncPolicy, logicalInventoryRestconfAPINode, logicalInventoryRestconfAPIVersion, logicalInventoryRestconfAPIEntity, logicalInventoryRestconfAPIEnableResyncPollingPolicyBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LogicalInventoryRestconfAPI', 'enableResyncPollingPolicy', 'default', data);
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

    const iETFL2ModelNetwork = 'fakedata';
    describe('#getL2TopologyAttributes - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getL2TopologyAttributes(iETFL2ModelNetwork, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['ietf-l2-topology:l2-topology-attributes']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL2Model', 'getL2TopologyAttributes', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getL2TopologyLinks(iETFL2ModelNetwork, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL2Model', 'getL2TopologyLinks', 'default', data);
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

    const iETFL2ModelNode = 'fakedata';
    describe('#getL2TopologyNodeTerminationPoints - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getL2TopologyNodeTerminationPoints(iETFL2ModelNetwork, iETFL2ModelNode, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network-topology:termination-point']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL2Model', 'getL2TopologyNodeTerminationPoints', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNetwork((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getNetwork', 'default', data);
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

    const iETFL3ModelNetwork = 'fakedata';
    describe('#getSpecificNetwork - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificNetwork(iETFL3ModelNetwork, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network:network']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getSpecificNetwork', 'default', data);
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

    describe('#getL3TopologyAttribute - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getL3TopologyAttribute(iETFL3ModelNetwork, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['ietf-l3-unicast-topology:l3-topology-attributes']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getL3TopologyAttribute', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getNetworkType(iETFL3ModelNetwork, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['ietf-network:network-types']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getNetworkType', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getAllNodesInANetwork(iETFL3ModelNetwork, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network:node']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getAllNodesInANetwork', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSupportingNetwork(iETFL3ModelNetwork, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network:supporting-network']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getSupportingNetwork', 'default', data);
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

    const iETFL3ModelLink = 'fakedata';
    describe('#getSpecificLinkInANetwork - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificLinkInANetwork(iETFL3ModelNetwork, iETFL3ModelLink, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network-topology:link']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getSpecificLinkInANetwork', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.l3GETSRTopologyLinkAttributes(iETFL3ModelNetwork, iETFL3ModelLink, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['ietf-sr-mpls-topology:sr-mpls']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'l3GETSRTopologyLinkAttributes', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSupportingLink(iETFL3ModelNetwork, iETFL3ModelLink, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network:supporting-link']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getSupportingLink', 'default', data);
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

    const iETFL3ModelNode = 'fakedata';
    describe('#getSpecificNodeInANetwork - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificNodeInANetwork(iETFL3ModelNetwork, iETFL3ModelNode, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network:node']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getSpecificNodeInANetwork', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.l3GETSRTopologyNodeAttributes(iETFL3ModelNetwork, iETFL3ModelNode, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['ietf-sr-mpls-topology:sr-mpls']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'l3GETSRTopologyNodeAttributes', 'default', data);
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

    const iETFL3ModelTerminationPoint = 'fakedata';
    describe('#getSpecificTerminationPointsOfANode - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificTerminationPointsOfANode(iETFL3ModelNetwork, iETFL3ModelNode, iETFL3ModelTerminationPoint, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network-topology:termination-point']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getSpecificTerminationPointsOfANode', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSupportingTerminationPoint(iETFL3ModelNetwork, iETFL3ModelNode, iETFL3ModelTerminationPoint, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network:supporting-termination-point']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFL3Model', 'getSupportingTerminationPoint', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSAPNetwork((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['ietf-sap-ntw:sap-network']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFSAPTopology', 'getSAPNetwork', 'default', data);
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

    const iETFSAPTopologyNode = 'fakedata';
    describe('#getIETFNetworkFromSpecificNode - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIETFNetworkFromSpecificNode(iETFSAPTopologyNode, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-network:node']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFSAPTopology', 'getIETFNetworkFromSpecificNode', 'default', data);
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

    const iETFSAPTopologyNetwork = 'fakedata';
    const iETFSAPTopologyService = 'fakedata';
    describe('#getSAPsOnASpecificNodeOfSpecificServiceType - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSAPsOnASpecificNodeOfSpecificServiceType(iETFSAPTopologyNetwork, iETFSAPTopologyNode, iETFSAPTopologyService, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ietf-sap-ntw:service']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IETFSAPTopology', 'getSAPsOnASpecificNodeOfSpecificServiceType', 'default', data);
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

    const uploadMappingFilesNspPluginId = 'fakedata';
    const uploadMappingFilesFile = 'fakedata';
    describe('#loadIETFMappingFiles - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.loadIETFMappingFiles(uploadMappingFilesNspPluginId, uploadMappingFilesFile, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UploadMappingFiles', 'loadIETFMappingFiles', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIETFMappingFiles((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-yang-mapping-converter:nsp-yang-mapping-converter']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UploadMappingFiles', 'getIETFMappingFiles', 'default', data);
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

    const routerNECorrelationMappingServiceCreateMappingPolicyBodyParam = {
      'nsp-equipment-templates:router-ne-mapping': [
        {
          'system-id': '35.121.100.176',
          name: 'cisco ios mapping',
          'app-id': '',
          id: '',
          'object-description': '',
          'router-infos': [
            {
              'router-id': '35.121.100.178',
              'network-identifier': 0,
              'bgp-ls-id': 0,
              'as-number': 100,
              protocol: 'ANY'
            }
          ]
        }
      ]
    };
    describe('#createMappingPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createMappingPolicy(routerNECorrelationMappingServiceCreateMappingPolicyBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RouterNECorrelationMappingService', 'createMappingPolicy', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getCorrelationPolicy((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-equipment-templates:correlation-policy']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RouterNECorrelationMappingService', 'getCorrelationPolicy', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getRouterNeMapping((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-equipment-templates:router-ne-mapping']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RouterNECorrelationMappingService', 'getRouterNeMapping', 'default', data);
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

    const routerNECorrelationMappingServiceRouterNeMapping = 'fakedata';
    const routerNECorrelationMappingServiceUpdateMappingPolicyBodyParam = {
      'nsp-equipment-templates:router-ne-mapping': [
        {
          'system-id': '35.121.100.176',
          name: 'cisco ios mapping',
          'app-id': '',
          id: '',
          'object-description': '',
          'router-infos': [
            {
              'router-id': '35.121.100.177',
              'network-identifier': 0,
              'bgp-ls-id': 0,
              'as-number': 100,
              protocol: 'OSPFv2'
            }
          ]
        }
      ]
    };
    describe('#updateMappingPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateMappingPolicy(routerNECorrelationMappingServiceRouterNeMapping, routerNECorrelationMappingServiceUpdateMappingPolicyBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RouterNECorrelationMappingService', 'updateMappingPolicy', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificMappingPolicy(routerNECorrelationMappingServiceRouterNeMapping, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-equipment-templates:router-ne-mapping']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RouterNECorrelationMappingService', 'getSpecificMappingPolicy', 'default', data);
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

    const dataTablesRetentionUpdateTheRetentionTimeForIndicatorsBodyParam = {
      'ageout-policy': [
        {
          retention: 10
        }
      ]
    };
    describe('#updateTheRetentionTimeForIndicators - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateTheRetentionTimeForIndicators(dataTablesRetentionUpdateTheRetentionTimeForIndicatorsBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DataTablesRetention', 'updateTheRetentionTimeForIndicators', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIndicatorAgeoutPolicySettings((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ageout-policy']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DataTablesRetention', 'getIndicatorAgeoutPolicySettings', 'default', data);
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

    const dataTablesRetentionUpdateTheRetentionTimeForBaselineBodyParam = {
      'ageout-policy': [
        {
          retention: 10
        }
      ]
    };
    describe('#updateTheRetentionTimeForBaseline - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateTheRetentionTimeForBaseline(dataTablesRetentionUpdateTheRetentionTimeForBaselineBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DataTablesRetention', 'updateTheRetentionTimeForBaseline', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getBaselineAgeoutPolicySettings((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['ageout-policy']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DataTablesRetention', 'getBaselineAgeoutPolicySettings', 'default', data);
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

    const indicatorTemplatesAvgCPUAllNodesAllActionsBodyParam = {
      template: [
        {
          name: 'AvgCpuAllNodesAllActionsTemplate',
          description: 'avg cpu from all nodes template',
          formula: 'avg({cpu-usage_avg})',
          'units-name': '%',
          'telemetry-type': 'telemetry:/base/system-info/system',
          counters: [
            {
              name: 'cpu-usage',
              function: 'avg'
            }
          ],
          thresholds: [
            {
              'threshold-value-decimal': '20',
              direction: 'increasing',
              actions: [
                {
                  name: 'template_threshold_20_increasing_kafka_action',
                  type: 'kafka',
                  kafka: {
                    'topic-name': 'nsp-act-action-event',
                    'topic-content': 'CPU is a rising'
                  }
                },
                {
                  name: 'template_threshold_20_increasing_alarm_action',
                  type: 'alarm',
                  alarm: {
                    severity: 'major'
                  }
                },
                {
                  name: 'template_threshold_20_increasing_email_action',
                  type: 'email',
                  email: {
                    'email-address': 'userid@user.com',
                    'email-subject': 'Hmmmmm, It\'s getting hot',
                    'email-content': 'Your temperature is rising.'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
    describe('#avgCPUAllNodesAllActions - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.avgCPUAllNodesAllActions(indicatorTemplatesAvgCPUAllNodesAllActionsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response.created);
                assert.equal('/restconf/data/nsp-indicator:rta-indicator-templates/template=AvgCpuAllNodesAllActionsTemplate', data.response.Location);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorTemplates', 'avgCPUAllNodesAllActions', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getAllIndicatorTemplates((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-indicator:rta-indicator-templates']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorTemplates', 'getAllIndicatorTemplates', 'default', data);
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

    const indicatorTemplatesTemplate = 'fakedata';
    const indicatorTemplatesUPDATEIndicatorTemplateBodyParam = {
      template: [
        {
          name: 'MaxTempNfmp10.10.10.4Template',
          description: 'Update Indicator template using PUT "max\' temp on \'10.10.10.4\' template',
          formula: 'max({temperature_avg})',
          'units-name': 'deg C',
          'telemetry-type': 'telemetry:/base/hardware/temperature',
          counters: [
            {
              name: 'temperature',
              function: 'avg'
            }
          ],
          thresholds: [
            {
              'threshold-value-decimal': '60',
              direction: 'increasing',
              actions: [
                {
                  name: 'template_threshold_60_increasing_kafka_action',
                  type: 'kafka',
                  kafka: {
                    'topic-name': 'nsp-act-action-event',
                    'topic-content': 'Temperature is a rising on 10.10.10.4'
                  }
                },
                {
                  name: 'template_threshold_60_increasing_alarm_action',
                  type: 'alarm',
                  alarm: {
                    severity: 'critical'
                  }
                },
                {
                  name: 'template_threshold_60_increasing_email_action',
                  type: 'email',
                  email: {
                    'email-address': 'userid@user.com',
                    'email-subject': 'Hmmmmm, It\'s getting hot 10.10.10.4',
                    'email-content': 'Your temperature is rising 10.10.10.4.'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
    describe('#uPDATEIndicatorTemplate - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.uPDATEIndicatorTemplate(indicatorTemplatesTemplate, indicatorTemplatesUPDATEIndicatorTemplateBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorTemplates', 'uPDATEIndicatorTemplate', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificIndicatorTemplate(indicatorTemplatesTemplate, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-indicator:template']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorTemplates', 'getSpecificIndicatorTemplate', 'default', data);
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

    const indicatorRulesPostavgCPUAllNodesAllActionsBodyParam = {
      rule: [
        {
          name: 'AvgCpuAllNodesAllActions',
          description: 'avg cpu from all nodes',
          formula: 'avg({cpu-usage_avg})',
          'window-duration': 'PT1M',
          'units-name': '%',
          enabled: true,
          'collection-interval': 30,
          'telemetry-type': 'telemetry:/base/system-info/system',
          counters: [
            {
              name: 'cpu-usage',
              function: 'avg'
            }
          ],
          thresholds: [
            {
              'threshold-value-decimal': '20',
              direction: 'increasing',
              actions: [
                {
                  type: 'kafka',
                  kafka: {
                    'topic-name': 'nsp-act-action-event',
                    'topic-content': 'CPU is a rising'
                  }
                },
                {
                  type: 'alarm',
                  alarm: {
                    severity: 'major'
                  }
                },
                {
                  type: 'email',
                  email: {
                    'email-address': 'userid@user.com',
                    'email-subject': 'Hmmmmm, It\'s getting hot',
                    'email-content': 'Your temperature is rising.'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
    describe('#postavgCPUAllNodesAllActions - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.postavgCPUAllNodesAllActions(indicatorRulesPostavgCPUAllNodesAllActionsBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorRules', 'postavgCPUAllNodesAllActions', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getAllIndicatorRules((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-indicator:rta-indicator-rules']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorRules', 'getAllIndicatorRules', 'default', data);
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

    const indicatorRulesRule = 'fakedata';
    const indicatorRulesUpdateIndicatorRuleBodyParam = {
      rule: [
        {
          name: 'MaxTempNfmp104',
          description: 'Updated using PUT request "max\' temp on \'10.10.10.4\'',
          formula: 'max({temperature_avg})',
          'window-duration': 'PT1M',
          'units-name': 'deg C',
          enabled: true,
          'collection-interval': 60,
          'telemetry-type': 'telemetry:/base/hardware/temperature',
          'subscription-filter': '/nsp-equipment:network/network-element[ne-id=\'10.10.10.4\']',
          counters: [
            {
              name: 'temperature',
              function: 'avg'
            }
          ],
          thresholds: [
            {
              'threshold-value-decimal': '60',
              direction: 'increasing',
              actions: [
                {
                  type: 'kafka',
                  kafka: {
                    'topic-name': 'nsp-act-action-event',
                    'topic-content': 'Temperature is a rising on 10.10.10.4'
                  }
                },
                {
                  type: 'alarm',
                  alarm: {
                    severity: 'critical'
                  }
                },
                {
                  type: 'email',
                  email: {
                    'email-address': 'userid@user.com',
                    'email-subject': 'Hmmmmm, It\'s getting hot 10.10.10.4',
                    'email-content': 'Your temperature is rising 10.10.10.4'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
    describe('#updateIndicatorRule - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateIndicatorRule(indicatorRulesRule, indicatorRulesUpdateIndicatorRuleBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorRules', 'updateIndicatorRule', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificIndicatorRule(indicatorRulesRule, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-indicator:rule']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorRules', 'getSpecificIndicatorRule', 'default', data);
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

    const baselineOperationsRestconfAPICreateSubscriptionBodyParam = {
      subscription: [
        {
          name: 'test-sub-baseline-mdm',
          filter: '/network-device-mgr:network-devices/network-device[name=\'2.2.2.2\']/root/nokia-state:state/port[port-id=\'1/1/1\']',
          type: 'telemetry:/base/interfaces/interface',
          fields: [
            'received-octets'
          ],
          description: '',
          period: 60,
          'sync-time': '00:00',
          state: 'enabled',
          notification: 'disabled',
          'rta-notification': 'enabled',
          db: 'disabled'
        }
      ]
    };
    describe('#createSubscription - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createSubscription(baselineOperationsRestconfAPICreateSubscriptionBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'createSubscription', 'default', data);
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

    const baselineOperationsRestconfAPICreateBaselineBodyParam = {
      baseline: {
        'admin-state': 'up',
        'update-status': 'active',
        name: '2.2.2.2, 1/1/1',
        description: 'restconf_baseline_nodeB',
        resource: '/network-device-mgr:network-devices/network-device[name=\'2.2.2.2\']/root/nokia-state:state/port[port-id=\'1/1/1\']',
        'collection-interval': 60,
        period: 'pt5m',
        'window-duration': 'pt1m',
        'counter-group': 'telemetry:/base/interfaces/interface',
        counter: 'received-octets',
        'use-bit-rate': false,
        'units-name': 'octets',
        type: 'counter',
        subscriptionid: 'test-sub-baseline-mdm'
      }
    };
    describe('#createBaseline - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createBaseline(baselineOperationsRestconfAPICreateBaselineBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'createBaseline', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getAllBaselines((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-rt-analytics:baseline']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'getAllBaselines', 'default', data);
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

    const baselineOperationsRestconfAPIBaseline = 'fakedata';
    const baselineOperationsRestconfAPICreateBaselineDetectorBodyParam = {
      baseline: {
        'baseline-detector': [
          {
            algorithm: 'relative-diff-mean',
            comparison: 'greater-than',
            threshold: 0.1,
            'evaluate-when': 'end-of-window',
            'evaluate-what': 'value_'
          }
        ]
      }
    };
    describe('#createBaselineDetector - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createBaselineDetector(baselineOperationsRestconfAPIBaseline, baselineOperationsRestconfAPICreateBaselineDetectorBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'createBaselineDetector', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getBaseline(baselineOperationsRestconfAPIBaseline, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-rt-analytics:baseline']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'getBaseline', 'default', data);
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

    const baselineOperationsRestconfAPIBaselineDetector = 'fakedata';
    const baselineOperationsRestconfAPIPatchBaselineDetectorBodyParam = {
      'baseline-detector': {
        comparison: 'less-than'
      }
    };
    describe('#patchBaselineDetector - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.patchBaselineDetector(baselineOperationsRestconfAPIBaseline, baselineOperationsRestconfAPIBaselineDetector, baselineOperationsRestconfAPIPatchBaselineDetectorBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'patchBaselineDetector', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getBaselineDetector(baselineOperationsRestconfAPIBaseline, baselineOperationsRestconfAPIBaselineDetector, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-rt-analytics:baseline-detector']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'getBaselineDetector', 'default', data);
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

    const intentTypeManagementImportIntentTypeFromIntentManagerBodyParam = {
      input: {
        'imported-intent-types': [
          {
            name: 'icm-equipment-port-ethernet',
            version: 2
          },
          {
            name: 'icm-qos-sapegress-srqos',
            version: 2
          },
          {
            name: 'icm-qos-sapingress-srqos',
            version: 2
          },
          {
            name: 'icm-logical-lag-access',
            version: 2
          },
          {
            name: 'icm-router-policystatement-srrouter',
            version: 2
          },
          {
            name: 'icm-system-ptp',
            version: 2
          },
          {
            name: 'icm-equipment-port-e_m',
            version: 2
          }
        ]
      }
    };
    describe('#importIntentTypeFromIntentManager - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.importIntentTypeFromIntentManager(intentTypeManagementImportIntentTypeFromIntentManagerBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IntentTypeManagement', 'importIntentTypeFromIntentManager', 'default', data);
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

    const intentTypeManagementRemoveIntentTypeBodyParam = {
      input: {
        name: 'icm-system-ptp',
        version: 2
      }
    };
    describe('#removeIntentType - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.removeIntentType(intentTypeManagementRemoveIntentTypeBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IntentTypeManagement', 'removeIntentType', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIntentTypes((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:imported-intent-types']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IntentTypeManagement', 'getIntentTypes', 'default', data);
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

    const configurationTemplatesCreateTemplateBodyParam = {
      template: [
        {
          name: 'Gold Port',
          description: 'Configure an access port with Gold profile',
          'life-cycle-state': 'released',
          'intent-type': 'icm-equipment-port-ethernet',
          'intent-type-version': 2,
          'schema-form-name': 'gold.schemaForm'
        }
      ]
    };
    describe('#createTemplate - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createTemplate(configurationTemplatesCreateTemplateBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('Buffer', data.response.type);
                assert.equal(true, Array.isArray(data.response.data));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationTemplates', 'createTemplate', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getTemplates((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:templates']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationTemplates', 'getTemplates', 'default', data);
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

    const configurationTemplatesTemplate = 'fakedata';
    const configurationTemplatesUpdateTemplateLifecycleBodyParam = {
      template: [
        {
          'life-cycle-state': 'obsolete'
        }
      ]
    };
    describe('#updateTemplateLifecycle - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateTemplateLifecycle(configurationTemplatesTemplate, configurationTemplatesUpdateTemplateLifecycleBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationTemplates', 'updateTemplateLifecycle', 'default', data);
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

    const configurationDeploymentsCategory = 'fakedata';
    const configurationDeploymentsCreatePortGroupDirectoryBodyParam = {
      groupDirectoryName: 'GroupDir1'
    };
    describe('#createPortGroupDirectory - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createPortGroupDirectory(configurationDeploymentsCategory, configurationDeploymentsCreatePortGroupDirectoryBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response.response);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'createPortGroupDirectory', 'default', data);
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

    const configurationDeploymentsCreatePortGroupBodyParam = {
      advanceFilterExpression: '( name EQUAL \'1/2/3\' OR  name EQUAL \'1/2/4\' OR  name EQUAL \'1/2/5\')',
      alarmsSeverity: 'critical',
      filterEditable: true,
      groupName: 'AccessPorts',
      groupDescription: 'N/A',
      groupDirectoryFdn: '{{groupDirFDN}}',
      usePhysicalMapLayout: true
    };
    describe('#createPortGroup - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createPortGroup(configurationDeploymentsCategory, configurationDeploymentsCreatePortGroupBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response.response);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'createPortGroup', 'default', data);
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

    const configurationDeploymentsCreateDeploymentBodyParam = {
      input: {
        deployments: [
          {
            'deployment-action': 'deploy',
            'template-name': 'Gold Port',
            targets: [
              {
                target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeA}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/7\']',
                'target-identifier-value': '1/2/7'
              },
              {
                target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeA}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/8\']',
                'target-identifier-value': '1/2/8'
              }
            ]
          }
        ]
      }
    };
    describe('#createDeployment - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createDeployment(configurationDeploymentsCreateDeploymentBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'createDeployment', 'default', data);
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

    const configurationDeploymentsDeleteDeploymentsBodyParam = {
      input: {
        'delete-option': 'network-and-nsp',
        deployments: [
          {
            deployment: '/nsp-icm:icm/deployments/deployment[template-name=\'Configure Port\'][target=\'/nsp-equipment:network/network-element[ne-id=\'{{nodeB}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/9\']\'][target-identifier-value=\'1/2/9\']'
          },
          {
            deployment: '/nsp-icm:icm/deployments/deployment[template-name=\'Configure Port\'][target=\'/nsp-equipment:network/network-element[ne-id=\'{{nodeB}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/10\']\'][target-identifier-value=\'1/2/10\']'
          },
          {
            deployment: '/nsp-icm:icm/deployments/deployment[template-name=\'Configure Port\'][target=\'/nsp-equipment:network/network-element[ne-id=\'{{nodeA}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/8\']\'][target-identifier-value=\'1/2/8\']'
          }
        ]
      }
    };
    describe('#deleteDeployments - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.deleteDeployments(configurationDeploymentsDeleteDeploymentsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'deleteDeployments', 'default', data);
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

    const configurationDeploymentsReplaceDeploymentBodyParam = {
      input: {
        'old-template-name': 'Gold Port',
        'new-template-name': 'Configure Port',
        'target-data': '{"port\':{\'description\':null,\'ethernet\':{\'dot1q-etype\':null,\'pbb-etype\':null,\'qinq-etype\':null,\'hold-time\':{},\'down-when-looped\':{},\'lldp\':{\'dest-mac\':[]},\'encap-type\':\'qinq\',\'mtu\':1600,\'mode\':\'access\'},\'admin-state\':\'enable\'}}',
        'deployment-action': 'deploy',
        targets: [
          {
            target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeA}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/7\']',
            'target-identifier-value': '1/2/7'
          },
          {
            target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeA}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/8\']',
            'target-identifier-value': '1/2/8'
          }
        ]
      }
    };
    describe('#replaceDeployment - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.replaceDeployment(configurationDeploymentsReplaceDeploymentBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'replaceDeployment', 'default', data);
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

    const configurationDeploymentsUpdateDeploymentConfigurationBodyParam = {
      input: {
        deployments: [
          {
            'deployment-action': 'deploy',
            'template-name': 'Configure Port',
            'target-data': '{"port\':{\'description\':null,\'ethernet\':{\'dot1q-etype\':null,\'pbb-etype\':null,\'qinq-etype\':null,\'hold-time\':{},\'down-when-looped\':{},\'lldp\':{\'dest-mac\':[]},\'encap-type\':\'qinq\',\'mtu\':1600,\'mode\':\'access\'},\'admin-state\':\'enable\'}}',
            targets: [
              {
                target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeB}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/9\']',
                'target-identifier-value': '1/2/9'
              },
              {
                target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeB}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/10\']',
                'target-identifier-value': '1/2/10'
              }
            ]
          }
        ]
      }
    };
    describe('#updateDeploymentConfiguration - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.updateDeploymentConfiguration(configurationDeploymentsUpdateDeploymentConfigurationBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'updateDeploymentConfiguration', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getPortGroupFDN(configurationDeploymentsCategory, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response.response);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'getPortGroupFDN', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getDeployments((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:deployments']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'getDeployments', 'default', data);
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

    const configurationDeploymentsDeployment = 'fakedata';
    describe('#getSpecificDeployment - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getSpecificDeployment(configurationDeploymentsDeployment, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-icm:deployment']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'getSpecificDeployment', 'default', data);
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

    const brownfieldDiscoverDeploymentsBodyParam = {
      input: {
        'template-name': 'Gold Port',
        targets: [
          {
            target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeC}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/8\']',
            'target-identifier-value': '1/2/8'
          },
          {
            target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeC}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/9\']',
            'target-identifier-value': '1/2/9'
          },
          {
            target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeC}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=2/mda=2/port=1/2/10\']',
            'target-identifier-value': '1/2/10'
          }
        ]
      }
    };
    describe('#discoverDeployments - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.discoverDeployments(brownfieldDiscoverDeploymentsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Brownfield', 'discoverDeployments', 'default', data);
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

    const auditAndAlignmentDeployment = 'fakedata';
    const auditAndAlignmentAlignConfigurationDeploymentBodyParam = {};
    describe('#alignConfigurationDeployment - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.alignConfigurationDeployment(auditAndAlignmentDeployment, auditAndAlignmentAlignConfigurationDeploymentBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'alignConfigurationDeployment', 'default', data);
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

    const auditAndAlignmentAuditDeploymentBodyParam = {};
    describe('#auditDeployment - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.auditDeployment(auditAndAlignmentDeployment, auditAndAlignmentAuditDeploymentBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'auditDeployment', 'default', data);
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

    const auditAndAlignmentTemplate = 'fakedata';
    const auditAndAlignmentAlignConfigurationTemplateAllDeploymentsBodyParam = {};
    describe('#alignConfigurationTemplateAllDeployments - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.alignConfigurationTemplateAllDeployments(auditAndAlignmentTemplate, auditAndAlignmentAlignConfigurationTemplateAllDeploymentsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'alignConfigurationTemplateAllDeployments', 'default', data);
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

    const auditAndAlignmentAlignConfigurationTemplateMisalignedDeploymentsBodyParam = {};
    describe('#alignConfigurationTemplateMisalignedDeployments - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.alignConfigurationTemplateMisalignedDeployments(auditAndAlignmentTemplate, auditAndAlignmentAlignConfigurationTemplateMisalignedDeploymentsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'alignConfigurationTemplateMisalignedDeployments', 'default', data);
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

    const auditAndAlignmentAuditTemplateBodyParam = {};
    describe('#auditTemplate - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.auditTemplate(auditAndAlignmentTemplate, auditAndAlignmentAuditTemplateBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'auditTemplate', 'default', data);
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

    const auditAndAlignmentCheckAuditStatusCountBodyParam = {};
    describe('#checkAuditStatusCount - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.checkAuditStatusCount(auditAndAlignmentTemplate, auditAndAlignmentCheckAuditStatusCountBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'checkAuditStatusCount', 'default', data);
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

    const auditAndAlignmentAuditNodeDeploymentsBodyParam = {
      input: {
        'ne-ids': [
          '{{nodeA}}',
          '{{nodeB}}'
        ],
        action: 'audit'
      }
    };
    describe('#auditNodeDeployments - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.auditNodeDeployments(auditAndAlignmentAuditNodeDeploymentsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'auditNodeDeployments', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getAuditDetails(auditAndAlignmentDeployment, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:audit-details']);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AuditAndAlignment', 'getAuditDetails', 'default', data);
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

    const templateMigrationCloneTemplateBodyParam = {
      input: {
        'source-template-name': 'Gold Port',
        name: 'Gold Port Updated',
        description: 'New gold port with updated model',
        'life-cycle-state': 'released'
      }
    };
    describe('#cloneTemplate - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.cloneTemplate(templateMigrationCloneTemplateBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('TemplateMigration', 'cloneTemplate', 'default', data);
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

    const templateMigrationMigrateDeploymentsBodyParam = {
      input: {
        'source-template-name': 'Gold Port',
        'target-template-name': 'Gold Port Updated',
        'target-data': '{"port\':{\'ethernet\':{\'mtu\':1492}}}',
        'source-deployments': [
          {
            target: '/nsp-equipment:network/network-element[ne-id=\'{{nodeA}}\']/hardware-component/port[component-id=\'shelf=1/cardSlot=1/card=1/mdaSlot=1/mda=1/port=1/2/4\']',
            'target-identifier-value': '1/2/4'
          }
        ]
      }
    };
    describe('#migrateDeployments - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.migrateDeployments(templateMigrationMigrateDeploymentsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('object', typeof data.response['nsp-icm:output']);
                assert.equal('OK', data.response.statusCode);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('TemplateMigration', 'migrateDeployments', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteIntent(intentIntent, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Intent', 'deleteIntent', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.devAdminDeleteAutodiscoverNe(manageZTPListFromDeviceAdministratorAutodiscoveryNe, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ManageZTPListFromDeviceAdministrator', 'devAdminDeleteAutodiscoverNe', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteAllPoliciesOnARouter(routerNECorrelationMappingServiceRouterNeMapping, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RouterNECorrelationMappingService', 'deleteAllPoliciesOnARouter', 'default', data);
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

    const routerNECorrelationMappingServiceRouterInfos = 'fakedata';
    describe('#deleteOnePolicyOfRouter - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteOnePolicyOfRouter(routerNECorrelationMappingServiceRouterNeMapping, routerNECorrelationMappingServiceRouterInfos, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RouterNECorrelationMappingService', 'deleteOnePolicyOfRouter', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteIndicatorTemplate(indicatorTemplatesTemplate, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorTemplates', 'deleteIndicatorTemplate', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteIndicatorRule(indicatorRulesRule, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IndicatorRules', 'deleteIndicatorRule', 'default', data);
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

    const baselineOperationsRestconfAPISubscription = 'fakedata';
    describe('#deleteSubscription - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteSubscription(baselineOperationsRestconfAPISubscription, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'deleteSubscription', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteBaseline(baselineOperationsRestconfAPIBaseline, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'deleteBaseline', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteBaselineDetector(baselineOperationsRestconfAPIBaseline, baselineOperationsRestconfAPIBaselineDetector, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('BaselineOperationsRestconfAPI', 'deleteBaselineDetector', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteTemplate(configurationTemplatesTemplate, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationTemplates', 'deleteTemplate', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteSingleDeployment(configurationDeploymentsDeployment, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigurationDeployments', 'deleteSingleDeployment', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNE(null, null, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getNE', 'default', data);
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

    describe('#getSpecificNE - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificNE('fakedata', null, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getSpecificNE', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getShelf((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getShelf', 'default', data);
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

    describe('#getSpecificShelf - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificShelf('fakedata', 'fakedata', (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getSpecificShelf', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCard((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getCard', 'default', data);
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

    describe('#getSpecificNECards - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificNECards('fakedata', 'fakedata', (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getSpecificNECards', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPort((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getPort', 'default', data);
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

    describe('#getPortFromSpecificNE - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPortFromSpecificNE('fakedata', 'fakedata', (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getPortFromSpecificNE', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPortFromSpecificNETransceiverDetails('fakedata', 'fakedata', (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getPortFromSpecificNETransceiverDetails', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getLags((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getLags', 'default', data);
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

    describe('#getSpecificNELag - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificNELag('fakedata', (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getSpecificNELag', 'default', data);
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
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificNELagWithFields('fakedata', 'fakedata', 'fakedata', (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-nokia_nsp_network_management-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getSpecificNELagWithFields', 'default', data);
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
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getRadio((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(true, Array.isArray(data.response['nsp-equipment:radio']));
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkInventoryRestconfAPI', 'getRadio', 'default', data);
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
  });
});
