/* @copyright Itential, LLC 2019 (pre-modifications) */

/* eslint import/no-dynamic-require: warn */
/* eslint object-curly-newline: warn */
/* eslint default-param-last: warn */

// Set globals
/* global log */

/* Required libraries.  */
const path = require('path');

/* Fetch in the other needed components for the this Adaptor */
const AdapterBaseCl = require(path.join(__dirname, 'adapterBase.js'));

/**
 * This is the adapter/interface into nokia_nsp_network_management
 */

/* GENERAL ADAPTER FUNCTIONS */
class NokiaNspNetworkManagement extends AdapterBaseCl {
  /**
   * NokiaNspNetworkManagement Adapter
   * @constructor
   */
  /* Working on changing the way we do Emit methods due to size and time constrainsts
  constructor(prongid, properties) {
    // Instantiate the AdapterBase super class
    super(prongid, properties);

    const restFunctionNames = this.iapGetAdapterWorkflowFunctions();

    // Dynamically bind emit functions
    for (let i = 0; i < restFunctionNames.length; i += 1) {
      // Bind function to have name fnNameEmit for fnName
      const version = restFunctionNames[i].match(/__v[0-9]+/);
      const baseFnName = restFunctionNames[i].replace(/__v[0-9]+/, '');
      const fnNameEmit = version ? `${baseFnName}Emit${version}` : `${baseFnName}Emit`;
      this[fnNameEmit] = function (...args) {
        // extract the callback
        const callback = args[args.length - 1];
        // slice the callback from args so we can insert our own
        const functionArgs = args.slice(0, args.length - 1);
        // create a random name for the listener
        const eventName = `${restFunctionNames[i]}:${Math.random().toString(36)}`;
        // tell the calling class to start listening
        callback({ event: eventName, status: 'received' });
        // store parent for use of this context later
        const parent = this;
        // store emission function
        const func = function (val, err) {
          parent.removeListener(eventName, func);
          parent.emit(eventName, val, err);
        };
        // Use apply to call the function in a specific context
        this[restFunctionNames[i]].apply(this, functionArgs.concat([func])); // eslint-disable-line prefer-spread
      };
    }

    // Uncomment if you have things to add to the constructor like using your own properties.
    // Otherwise the constructor in the adapterBase will be used.
    // Capture my own properties - they need to be defined in propertiesSchema.json
    // if (this.allProps && this.allProps.myownproperty) {
    //   mypropvariable = this.allProps.myownproperty;
    // }
  }
  */

  /**
   * @callback healthCallback
   * @param {Object} reqObj - the request to send into the healthcheck
   * @param {Callback} callback - The results of the call
   */
  healthCheck(reqObj, callback) {
    // you can modify what is passed into the healthcheck by changing things in the newReq
    let newReq = null;
    if (reqObj) {
      newReq = Object.assign(...reqObj);
    }
    super.healthCheck(newReq, callback);
  }

  /**
   * @iapGetAdapterWorkflowFunctions
   */
  iapGetAdapterWorkflowFunctions(inIgnore) {
    let myIgnore = [
      'healthCheck',
      'iapGetAdapterWorkflowFunctions',
      'hasEntities',
      'getAuthorization'
    ];
    if (!inIgnore && Array.isArray(inIgnore)) {
      myIgnore = inIgnore;
    } else if (!inIgnore && typeof inIgnore === 'string') {
      myIgnore = [inIgnore];
    }

    // The generic adapter functions should already be ignored (e.g. healthCheck)
    // you can add specific methods that you do not want to be workflow functions to ignore like below
    // myIgnore.push('myMethodNotInWorkflow');

    return super.iapGetAdapterWorkflowFunctions(myIgnore);
  }

  /**
   * iapUpdateAdapterConfiguration is used to update any of the adapter configuration files. This
   * allows customers to make changes to adapter configuration without having to be on the
   * file system.
   *
   * @function iapUpdateAdapterConfiguration
   * @param {string} configFile - the name of the file being updated (required)
   * @param {Object} changes - an object containing all of the changes = formatted like the configuration file (required)
   * @param {string} entity - the entity to be changed, if an action, schema or mock data file (optional)
   * @param {string} type - the type of entity file to change, (action, schema, mock) (optional)
   * @param {string} action - the action to be changed, if an action, schema or mock data file (optional)
   * @param {boolean} replace - true to replace entire mock data, false to merge/append
   * @param {Callback} callback - The results of the call
   */
  iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, replace, callback) {
    const meth = 'adapter-iapUpdateAdapterConfiguration';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    super.iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, replace, callback);
  }

  /**
    * @summary Suspends adapter
    *
    * @function iapSuspendAdapter
    * @param {Callback} callback - callback function
    */
  iapSuspendAdapter(mode, callback) {
    const meth = 'adapter-iapSuspendAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapSuspendAdapter(mode, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Unsuspends adapter
    *
    * @function iapUnsuspendAdapter
    * @param {Callback} callback - callback function
    */
  iapUnsuspendAdapter(callback) {
    const meth = 'adapter-iapUnsuspendAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapUnsuspendAdapter(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Get the Adapter Queue
    *
    * @function iapGetAdapterQueue
    * @param {Callback} callback - callback function
    */
  iapGetAdapterQueue(callback) {
    const meth = 'adapter-iapGetAdapterQueue';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapGetAdapterQueue(callback);
  }

  /* SCRIPT CALLS */
  /**
   * See if the API path provided is found in this adapter
   *
   * @function iapFindAdapterPath
   * @param {string} apiPath - the api path to check on
   * @param {Callback} callback - The results of the call
   */
  iapFindAdapterPath(apiPath, callback) {
    const meth = 'adapter-iapFindAdapterPath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    super.iapFindAdapterPath(apiPath, callback);
  }

  /**
  * @summary Runs troubleshoot scripts for adapter
  *
  * @function iapTroubleshootAdapter
  * @param {Object} props - the connection, healthcheck and authentication properties
  *
  * @param {Callback} callback - The results of the call
  */
  iapTroubleshootAdapter(props, callback) {
    const meth = 'adapter-iapTroubleshootAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapTroubleshootAdapter(props, this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs healthcheck script for adapter
    *
    * @function iapRunAdapterHealthcheck
    * @param {Adapter} adapter - adapter instance to troubleshoot
    * @param {Callback} callback - callback function
    */
  iapRunAdapterHealthcheck(callback) {
    const meth = 'adapter-iapRunAdapterHealthcheck';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterHealthcheck(this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs connectivity check script for adapter
    *
    * @function iapRunAdapterConnectivity
    * @param {Callback} callback - callback function
    */
  iapRunAdapterConnectivity(callback) {
    const meth = 'adapter-iapRunAdapterConnectivity';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterConnectivity(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs basicGet script for adapter
    *
    * @function iapRunAdapterBasicGet
    * @param {number} maxCalls - how many GET endpoints to test (optional)
    * @param {Callback} callback - callback function
    */
  iapRunAdapterBasicGet(maxCalls, callback) {
    const meth = 'adapter-iapRunAdapterBasicGet';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterBasicGet(maxCalls, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
   * @summary moves entites into Mongo DB
   *
   * @function iapMoveAdapterEntitiesToDB
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                                  or the error
   */
  iapMoveAdapterEntitiesToDB(callback) {
    const meth = 'adapter-iapMoveAdapterEntitiesToDB';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapMoveAdapterEntitiesToDB(callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Deactivate adapter tasks
   *
   * @function iapDeactivateTasks
   *
   * @param {Array} tasks - List of tasks to deactivate
   * @param {Callback} callback
   */
  iapDeactivateTasks(tasks, callback) {
    const meth = 'adapter-iapDeactivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapDeactivateTasks(tasks, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Activate adapter tasks that have previously been deactivated
   *
   * @function iapActivateTasks
   *
   * @param {Array} tasks - List of tasks to activate
   * @param {Callback} callback
   */
  iapActivateTasks(tasks, callback) {
    const meth = 'adapter-iapActivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapActivateTasks(tasks, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* CACHE CALLS */
  /**
   * @summary Populate the cache for the given entities
   *
   * @function iapPopulateEntityCache
   * @param {String/Array of Strings} entityType - the entity type(s) to populate
   * @param {Callback} callback - whether the cache was updated or not for each entity type
   *
   * @returns status of the populate
   */
  iapPopulateEntityCache(entityTypes, callback) {
    const meth = 'adapter-iapPopulateEntityCache';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapPopulateEntityCache(entityTypes, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Retrieves data from cache for specified entity type
   *
   * @function iapRetrieveEntitiesCache
   * @param {String} entityType - entity of which to retrieve
   * @param {Object} options - settings of which data to return and how to return it
   * @param {Callback} callback - the data if it was retrieved
   */
  iapRetrieveEntitiesCache(entityType, options, callback) {
    const meth = 'adapter-iapCheckEiapRetrieveEntitiesCachentityCached';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRetrieveEntitiesCache(entityType, options, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* BROKER CALLS */
  /**
   * @summary Determines if this adapter supports any in a list of entities
   *
   * @function hasEntities
   * @param {String} entityType - the entity type to check for
   * @param {Array} entityList - the list of entities we are looking for
   *
   * @param {Callback} callback - A map where the entity is the key and the
   *                              value is true or false
   */
  hasEntities(entityType, entityList, callback) {
    const meth = 'adapter-hasEntities';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.hasEntities(entityType, entityList, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Get Appliance that match the deviceName
   *
   * @function getDevice
   * @param {String} deviceName - the deviceName to find (required)
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliance) or the error
   */
  getDevice(deviceName, callback) {
    const meth = 'adapter-getDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getDevice(deviceName, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Get Appliances that match the filter
   *
   * @function getDevicesFiltered
   * @param {Object} options - the data to use to filter the appliances (optional)
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliances) or the error
   */
  getDevicesFiltered(options, callback) {
    const meth = 'adapter-getDevicesFiltered';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getDevicesFiltered(options, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Gets the status for the provided appliance
   *
   * @function isAlive
   * @param {String} deviceName - the deviceName of the appliance. (required)
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance isAlive) or the error
   */
  isAlive(deviceName, callback) {
    const meth = 'adapter-isAlive';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.isAlive(deviceName, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Gets a config for the provided Appliance
   *
   * @function getConfig
   * @param {String} deviceName - the deviceName of the appliance. (required)
   * @param {String} format - the desired format of the config. (optional)
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance config) or the error
   */
  getConfig(deviceName, format, callback) {
    const meth = 'adapter-getConfig';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getConfig(deviceName, format, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Gets the device count from the system
   *
   * @function iapGetDeviceCount
   *
   * @param {getCallback} callback - callback function to return the result
   *                                    (count) or the error
   */
  iapGetDeviceCount(callback) {
    const meth = 'adapter-iapGetDeviceCount';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapGetDeviceCount(callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* GENERIC ADAPTER REQUEST - allows extension of adapter without new calls being added */
  /**
   * Makes the requested generic call
   *
   * @function iapExpandedGenericAdapterRequest
   * @param {Object} metadata - metadata for the call (optional).
   *                 Can be a stringified Object.
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (optional)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (optional)
   * @param {Object} pathVars - the parameters to be put within the url path (optional).
   *                 Can be a stringified Object.
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-iapExpandedGenericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * Makes the requested generic call
   *
   * @function genericAdapterRequest
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-genericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * Makes the requested generic call with no base path or version
   *
   * @function genericAdapterRequestNoBasePath
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-genericAdapterRequestNoBasePath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* INVENTORY CALLS */
  /**
   * @summary run the adapter lint script to return the results.
   *
   * @function iapRunAdapterLint
   * @param {Callback} callback - callback function
   */
  iapRunAdapterLint(callback) {
    const meth = 'adapter-iapRunAdapterLint';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapRunAdapterLint(callback);
  }

  /**
   * @summary run the adapter test scripts (baseunit and unit) to return the results.
   *    can not run integration as there can be implications with that.
   *
   * @function iapRunAdapterTests
   * @param {Callback} callback - callback function
   */
  iapRunAdapterTests(callback) {
    const meth = 'adapter-iapRunAdapterTests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapRunAdapterTests(callback);
  }

  /**
   * @summary provide inventory information abbout the adapter
   *
   * @function iapGetAdapterInventory
   * @param {Callback} callback - callback function
   */
  iapGetAdapterInventory(callback) {
    const meth = 'adapter-iapGetAdapterInventory';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapGetAdapterInventory(callback);
  }

  /**
   * @callback healthCallback
   * @param {Object} result - the result of the get request (contains an id and a status)
   */
  /**
   * @callback getCallback
   * @param {Object} result - the result of the get request (entity/ies)
   * @param {String} error - any error that occurred
   */
  /**
   * @callback createCallback
   * @param {Object} item - the newly created entity
   * @param {String} error - any error that occurred
   */
  /**
   * @callback updateCallback
   * @param {String} status - the status of the update action
   * @param {String} error - any error that occurred
   */
  /**
   * @callback deleteCallback
   * @param {String} status - the status of the delete action
   * @param {String} error - any error that occurred
   */

  /**
   * @function retrieveNetworkInterfaces
   * @pronghornType method
   * @name retrieveNetworkInterfaces
   * @summary retrieveNetworkInterfaces
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkInterfaces
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkInterfaces(network, node, callback) {
    const meth = 'adapter-retrieveNetworkInterfaces';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfaces', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkInterfaces'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkInterfacesConfig
   * @pronghornType method
   * @name retrieveNetworkInterfacesConfig
   * @summary retrieveNetworkInterfacesConfig
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkInterfacesConfig
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkInterfacesConfig(network, node, callback) {
    const meth = 'adapter-retrieveNetworkInterfacesConfig';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfacesConfig', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkInterfacesConfig'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkSubInterfaces
   * @pronghornType method
   * @name retrieveNetworkSubInterfaces
   * @summary retrieveNetworkSubInterfaces
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkSubInterfaces
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkSubInterfaces(network, node, callback) {
    const meth = 'adapter-retrieveNetworkSubInterfaces';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfaces', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkSubInterfaces'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkSubInterfacesConfig
   * @pronghornType method
   * @name retrieveNetworkSubInterfacesConfig
   * @summary retrieveNetworkSubInterfacesConfig
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} subinterface - subinterface param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkSubInterfacesConfig
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkSubInterfacesConfig(network, node, subinterface, callback) {
    const meth = 'adapter-retrieveNetworkSubInterfacesConfig';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (subinterface === undefined || subinterface === null || subinterface === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subinterface'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `subinterface=${subinterface}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesConfig', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkSubInterfacesConfig'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkSubInterfacesState
   * @pronghornType method
   * @name retrieveNetworkSubInterfacesState
   * @summary retrieveNetworkSubInterfacesState
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} subinterface - subinterface param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkSubInterfacesState
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkSubInterfacesState(network, node, subinterface, callback) {
    const meth = 'adapter-retrieveNetworkSubInterfacesState';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (subinterface === undefined || subinterface === null || subinterface === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subinterface'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `subinterface=${subinterface}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesState', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkSubInterfacesState'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkSubInterfacesIPv4Addresses
   * @pronghornType method
   * @name retrieveNetworkSubInterfacesIPv4Addresses
   * @summary retrieveNetworkSubInterfacesIPv4Addresses
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} interfaceParam - interfaceParam param
   * @param {string} subinterface - subinterface param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkSubInterfacesIPv4Addresses
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkSubInterfacesIPv4Addresses(network, node, interfaceParam, subinterface, callback) {
    const meth = 'adapter-retrieveNetworkSubInterfacesIPv4Addresses';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (interfaceParam === undefined || interfaceParam === null || interfaceParam === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['interfaceParam'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (subinterface === undefined || subinterface === null || subinterface === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subinterface'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `interface=${interfaceParam}`, `subinterface=${subinterface}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesIPv4Addresses', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkSubInterfacesIPv4Addresses'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkSubInterfacesIPv6Addresses
   * @pronghornType method
   * @name retrieveNetworkSubInterfacesIPv6Addresses
   * @summary retrieveNetworkSubInterfacesIPv6Addresses
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} subinterface - subinterface param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkSubInterfacesIPv6Addresses
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkSubInterfacesIPv6Addresses(network, node, subinterface, callback) {
    const meth = 'adapter-retrieveNetworkSubInterfacesIPv6Addresses';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (subinterface === undefined || subinterface === null || subinterface === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subinterface'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `subinterface=${subinterface}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkSubInterfacesIPv6Addresses', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkSubInterfacesIPv6Addresses'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkInterfacesUnnumbered
   * @pronghornType method
   * @name retrieveNetworkInterfacesUnnumbered
   * @summary retrieveNetworkInterfacesUnnumbered
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} subinterface - subinterface param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkInterfacesUnnumbered
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkInterfacesUnnumbered(network, node, subinterface, callback) {
    const meth = 'adapter-retrieveNetworkInterfacesUnnumbered';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (subinterface === undefined || subinterface === null || subinterface === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subinterface'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `subinterface=${subinterface}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfacesUnnumbered', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkInterfacesUnnumbered'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkInterfacesUnnumberedIntf
   * @pronghornType method
   * @name retrieveNetworkInterfacesUnnumberedIntf
   * @summary retrieveNetworkInterfacesUnnumberedIntf
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} subinterface - subinterface param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkInterfacesUnnumberedIntf
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkInterfacesUnnumberedIntf(network, node, subinterface, callback) {
    const meth = 'adapter-retrieveNetworkInterfacesUnnumberedIntf';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (subinterface === undefined || subinterface === null || subinterface === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subinterface'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `subinterface=${subinterface}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInterfacesUnnumberedIntf', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkInterfacesUnnumberedIntf'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveNetworkInstance
   * @pronghornType method
   * @name retrieveNetworkInstance
   * @summary retrieveNetworkInstance
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveNetworkInstance
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveNetworkInstance(network, node, callback) {
    const meth = 'adapter-retrieveNetworkInstance';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveNetworkInstance', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveNetworkInstance'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveResyncPolicyNodeVersionEntity
   * @pronghornType method
   * @name retrieveResyncPolicyNodeVersionEntity
   * @summary retrieveResyncPolicyNodeVersionEntity
   *
   * @param {string} resyncPolicy - resyncPolicy param
   * @param {string} node - node param
   * @param {string} version - version param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveResyncPolicyNodeVersionEntity
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveResyncPolicyNodeVersionEntity(resyncPolicy, node, version, callback) {
    const meth = 'adapter-retrieveResyncPolicyNodeVersionEntity';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (resyncPolicy === undefined || resyncPolicy === null || resyncPolicy === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['resyncPolicy'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (version === undefined || version === null || version === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['version'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`resync-policy=${resyncPolicy}`, `node=${node}`, `version=${version}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFLogicalInventoryRestconfAPI', 'retrieveResyncPolicyNodeVersionEntity', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveResyncPolicyNodeVersionEntity'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createUsingIntent
   * @pronghornType method
   * @name createUsingIntent
   * @summary createUsingIntent
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createUsingIntent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createUsingIntent(body, callback) {
    const meth = 'adapter-createUsingIntent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Intent', 'createUsingIntent', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createUsingIntent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function synchronizeIntent
   * @pronghornType method
   * @name synchronizeIntent
   * @summary synchronizeIntent
   *
   * @param {string} intent - intent param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /synchronizeIntent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  synchronizeIntent(intent, callback) {
    const meth = 'adapter-synchronizeIntent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (intent === undefined || intent === null || intent === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['intent'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`intent=${intent}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Intent', 'synchronizeIntent', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['synchronizeIntent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIntent
   * @pronghornType method
   * @name getIntent
   * @summary getIntent
   *
   * @param {string} intent - intent param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getIntent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIntent(intent, callback) {
    const meth = 'adapter-getIntent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (intent === undefined || intent === null || intent === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['intent'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`intent=${intent}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Intent', 'getIntent', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIntent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function modifyIntent
   * @pronghornType method
   * @name modifyIntent
   * @summary modifyIntent
   *
   * @param {string} intent - intent param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /modifyIntent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  modifyIntent(intent, body, callback) {
    const meth = 'adapter-modifyIntent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (intent === undefined || intent === null || intent === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['intent'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`intent=${intent}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Intent', 'modifyIntent', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['modifyIntent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteIntent
   * @pronghornType method
   * @name deleteIntent
   * @summary deleteIntent
   *
   * @param {string} intent - intent param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteIntent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteIntent(intent, callback) {
    const meth = 'adapter-deleteIntent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (intent === undefined || intent === null || intent === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['intent'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`intent=${intent}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Intent', 'deleteIntent', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteIntent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getZTPListFromDeviceAdministrator
   * @pronghornType method
   * @name getZTPListFromDeviceAdministrator
   * @summary getZTPListFromDeviceAdministrator
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getZTPListFromDeviceAdministrator
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getZTPListFromDeviceAdministrator(callback) {
    const meth = 'adapter-getZTPListFromDeviceAdministrator';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ManageZTPListFromDeviceAdministrator', 'getZTPListFromDeviceAdministrator', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getZTPListFromDeviceAdministrator'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function devAdminCreateAutodiscoveryNe
   * @pronghornType method
   * @name devAdminCreateAutodiscoveryNe
   * @summary devAdmin-CreateAutodiscoveryNe
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /devAdminCreateAutodiscoveryNe
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  devAdminCreateAutodiscoveryNe(body, callback) {
    const meth = 'adapter-devAdminCreateAutodiscoveryNe';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ManageZTPListFromDeviceAdministrator', 'devAdminCreateAutodiscoveryNe', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['devAdminCreateAutodiscoveryNe'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function devAdminUpdateAutodiscoveryNe
   * @pronghornType method
   * @name devAdminUpdateAutodiscoveryNe
   * @summary devAdmin-UpdateAutodiscovery-Ne
   *
   * @param {string} autodiscoveryNe - autodiscoveryNe param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /devAdminUpdateAutodiscoveryNe
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  devAdminUpdateAutodiscoveryNe(autodiscoveryNe, body, callback) {
    const meth = 'adapter-devAdminUpdateAutodiscoveryNe';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (autodiscoveryNe === undefined || autodiscoveryNe === null || autodiscoveryNe === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['autodiscoveryNe'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`autodiscovery-ne=${autodiscoveryNe}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ManageZTPListFromDeviceAdministrator', 'devAdminUpdateAutodiscoveryNe', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['devAdminUpdateAutodiscoveryNe'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function devAdminDeleteAutodiscoverNe
   * @pronghornType method
   * @name devAdminDeleteAutodiscoverNe
   * @summary devAdmin-DeleteAutodiscover-Ne
   *
   * @param {string} autodiscoveryNe - autodiscoveryNe param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /devAdminDeleteAutodiscoverNe
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  devAdminDeleteAutodiscoverNe(autodiscoveryNe, callback) {
    const meth = 'adapter-devAdminDeleteAutodiscoverNe';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (autodiscoveryNe === undefined || autodiscoveryNe === null || autodiscoveryNe === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['autodiscoveryNe'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`autodiscovery-ne=${autodiscoveryNe}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ManageZTPListFromDeviceAdministrator', 'devAdminDeleteAutodiscoverNe', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['devAdminDeleteAutodiscoverNe'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createIPv4AddressPool
   * @pronghornType method
   * @name createIPv4AddressPool
   * @summary createIPv4AddressPool
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createIPv4AddressPool
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createIPv4AddressPool(body, callback) {
    const meth = 'adapter-createIPv4AddressPool';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AddressPool', 'createIPv4AddressPool', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createIPv4AddressPool'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIPv4AddressPool
   * @pronghornType method
   * @name getIPv4AddressPool
   * @summary getIPv4AddressPool
   *
   * @param {string} ipResourcePools - ipResourcePools param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getIPv4AddressPool
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIPv4AddressPool(ipResourcePools, callback) {
    const meth = 'adapter-getIPv4AddressPool';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ipResourcePools === undefined || ipResourcePools === null || ipResourcePools === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ipResourcePools'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`ip-resource-pools=${ipResourcePools}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AddressPool', 'getIPv4AddressPool', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIPv4AddressPool'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function obtainValueFromPool
   * @pronghornType method
   * @name obtainValueFromPool
   * @summary obtainValueFromPool
   *
   * @param {string} ipResourcePools - ipResourcePools param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /obtainValueFromPool
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  obtainValueFromPool(ipResourcePools, body, callback) {
    const meth = 'adapter-obtainValueFromPool';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ipResourcePools === undefined || ipResourcePools === null || ipResourcePools === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ipResourcePools'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`ip-resource-pools=${ipResourcePools}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AddressPool', 'obtainValueFromPool', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['obtainValueFromPool'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function nspInventoryFindWithFilter
   * @pronghornType method
   * @name nspInventoryFindWithFilter
   * @summary nspInventoryFindWithFilter
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /nspInventoryFindWithFilter
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  nspInventoryFindWithFilter(body, callback) {
    const meth = 'adapter-nspInventoryFindWithFilter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LogicalInventoryRestconfAPI', 'nspInventoryFindWithFilter', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['nspInventoryFindWithFilter'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveResyncPolicy
   * @pronghornType method
   * @name retrieveResyncPolicy
   * @summary retrieveResyncPolicy
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /retrieveResyncPolicy
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveResyncPolicy(callback) {
    const meth = 'adapter-retrieveResyncPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LogicalInventoryRestconfAPI', 'retrieveResyncPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveResyncPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveResyncPolicyNEAndVersionSpecific
   * @pronghornType method
   * @name retrieveResyncPolicyNEAndVersionSpecific
   * @summary retrieveResyncPolicy-NEAndVersionSpecific
   *
   * @param {string} resyncPolicy - resyncPolicy param
   * @param {string} node - node param
   * @param {string} version - version param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveResyncPolicyNEAndVersionSpecific
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveResyncPolicyNEAndVersionSpecific(resyncPolicy, node, version, callback) {
    const meth = 'adapter-retrieveResyncPolicyNEAndVersionSpecific';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (resyncPolicy === undefined || resyncPolicy === null || resyncPolicy === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['resyncPolicy'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (version === undefined || version === null || version === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['version'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`resync-policy=${resyncPolicy}`, `node=${node}`, `version=${version}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LogicalInventoryRestconfAPI', 'retrieveResyncPolicyNEAndVersionSpecific', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveResyncPolicyNEAndVersionSpecific'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function retrieveResyncPollingPolicyNESpecific
   * @pronghornType method
   * @name retrieveResyncPollingPolicyNESpecific
   * @summary retrieveResync(Polling)Policy-NESpecific
   *
   * @param {string} resyncPolicy - resyncPolicy param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /retrieveResyncPollingPolicyNESpecific
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  retrieveResyncPollingPolicyNESpecific(resyncPolicy, node, callback) {
    const meth = 'adapter-retrieveResyncPollingPolicyNESpecific';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (resyncPolicy === undefined || resyncPolicy === null || resyncPolicy === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['resyncPolicy'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`resync-policy=${resyncPolicy}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LogicalInventoryRestconfAPI', 'retrieveResyncPollingPolicyNESpecific', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['retrieveResyncPollingPolicyNESpecific'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function enableResyncPollingPolicy
   * @pronghornType method
   * @name enableResyncPollingPolicy
   * @summary enableResync(Polling)Policy
   *
   * @param {string} resyncPolicy - resyncPolicy param
   * @param {string} node - node param
   * @param {string} version - version param
   * @param {string} entity - entity param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /enableResyncPollingPolicy
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  enableResyncPollingPolicy(resyncPolicy, node, version, entity, body, callback) {
    const meth = 'adapter-enableResyncPollingPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (resyncPolicy === undefined || resyncPolicy === null || resyncPolicy === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['resyncPolicy'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (version === undefined || version === null || version === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['version'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (entity === undefined || entity === null || entity === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['entity'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`resync-policy=${resyncPolicy}`, `node=${node}`, `version=${version}`, `entity=${entity}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LogicalInventoryRestconfAPI', 'enableResyncPollingPolicy', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['enableResyncPollingPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getL2TopologyLinks
   * @pronghornType method
   * @name getL2TopologyLinks
   * @summary gETL2TopologyLinks
   *
   * @param {string} network - network param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getL2TopologyLinks
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getL2TopologyLinks(network, callback) {
    const meth = 'adapter-getL2TopologyLinks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL2Model', 'getL2TopologyLinks', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getL2TopologyLinks'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getL2TopologyAttributes
   * @pronghornType method
   * @name getL2TopologyAttributes
   * @summary gETL2TopologyAttributes
   *
   * @param {string} network - network param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getL2TopologyAttributes
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getL2TopologyAttributes(network, callback) {
    const meth = 'adapter-getL2TopologyAttributes';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL2Model', 'getL2TopologyAttributes', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getL2TopologyAttributes'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getL2TopologyNodeTerminationPoints
   * @pronghornType method
   * @name getL2TopologyNodeTerminationPoints
   * @summary gETL2TopologyNodeTerminationPoints
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getL2TopologyNodeTerminationPoints
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getL2TopologyNodeTerminationPoints(network, node, callback) {
    const meth = 'adapter-getL2TopologyNodeTerminationPoints';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL2Model', 'getL2TopologyNodeTerminationPoints', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getL2TopologyNodeTerminationPoints'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificNetwork
   * @pronghornType method
   * @name getSpecificNetwork
   * @summary gETSpecificNetwork
   *
   * @param {string} network - network param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificNetwork
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNetwork(network, callback) {
    const meth = 'adapter-getSpecificNetwork';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getSpecificNetwork', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNetwork'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSupportingNetwork
   * @pronghornType method
   * @name getSupportingNetwork
   * @summary gETSupportingNetwork
   *
   * @param {string} network - network param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSupportingNetwork
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSupportingNetwork(network, callback) {
    const meth = 'adapter-getSupportingNetwork';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getSupportingNetwork', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSupportingNetwork'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getNetworkType
   * @pronghornType method
   * @name getNetworkType
   * @summary gETNetworkType
   *
   * @param {string} network - network param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getNetworkType
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetworkType(network, callback) {
    const meth = 'adapter-getNetworkType';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getNetworkType', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetworkType'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getNetwork
   * @pronghornType method
   * @name getNetwork
   * @summary gETNetwork
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getNetwork
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetwork(callback) {
    const meth = 'adapter-getNetwork';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getNetwork', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetwork'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getL3TopologyAttribute
   * @pronghornType method
   * @name getL3TopologyAttribute
   * @summary gETL3TopologyAttribute
   *
   * @param {string} network - network param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getL3TopologyAttribute
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getL3TopologyAttribute(network, callback) {
    const meth = 'adapter-getL3TopologyAttribute';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getL3TopologyAttribute', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getL3TopologyAttribute'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getAllNodesInANetwork
   * @pronghornType method
   * @name getAllNodesInANetwork
   * @summary gETAllNodesInANetwork
   *
   * @param {string} network - network param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getAllNodesInANetwork
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllNodesInANetwork(network, callback) {
    const meth = 'adapter-getAllNodesInANetwork';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getAllNodesInANetwork', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllNodesInANetwork'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificNodeInANetwork
   * @pronghornType method
   * @name getSpecificNodeInANetwork
   * @summary getSpecificNodeInANetwork
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificNodeInANetwork
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNodeInANetwork(network, node, callback) {
    const meth = 'adapter-getSpecificNodeInANetwork';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getSpecificNodeInANetwork', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNodeInANetwork'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificLinkInANetwork
   * @pronghornType method
   * @name getSpecificLinkInANetwork
   * @summary getSpecificLinkInANetwork
   *
   * @param {string} network - network param
   * @param {string} link - link param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificLinkInANetwork
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificLinkInANetwork(network, link, callback) {
    const meth = 'adapter-getSpecificLinkInANetwork';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (link === undefined || link === null || link === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['link'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `ietf-network-topology:link=${link}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getSpecificLinkInANetwork', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificLinkInANetwork'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSupportingLink
   * @pronghornType method
   * @name getSupportingLink
   * @summary getSupportingLink
   *
   * @param {string} network - network param
   * @param {string} link - link param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSupportingLink
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSupportingLink(network, link, callback) {
    const meth = 'adapter-getSupportingLink';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (link === undefined || link === null || link === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['link'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `ietf-network-topology:link=${link}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getSupportingLink', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSupportingLink'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificTerminationPointsOfANode
   * @pronghornType method
   * @name getSpecificTerminationPointsOfANode
   * @summary gETSpecificTerminationPointsOfANode
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} terminationPoint - terminationPoint param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificTerminationPointsOfANode
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificTerminationPointsOfANode(network, node, terminationPoint, callback) {
    const meth = 'adapter-getSpecificTerminationPointsOfANode';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (terminationPoint === undefined || terminationPoint === null || terminationPoint === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['terminationPoint'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `ietf-network-topology:termination-point=${terminationPoint}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getSpecificTerminationPointsOfANode', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificTerminationPointsOfANode'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSupportingTerminationPoint
   * @pronghornType method
   * @name getSupportingTerminationPoint
   * @summary gETSupportingTerminationPoint
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} terminationPoint - terminationPoint param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSupportingTerminationPoint
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSupportingTerminationPoint(network, node, terminationPoint, callback) {
    const meth = 'adapter-getSupportingTerminationPoint';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (terminationPoint === undefined || terminationPoint === null || terminationPoint === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['terminationPoint'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `ietf-network-topology:termination-point=${terminationPoint}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'getSupportingTerminationPoint', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSupportingTerminationPoint'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function l3GETSRTopologyNodeAttributes
   * @pronghornType method
   * @name l3GETSRTopologyNodeAttributes
   * @summary l3GETSRTopologyNodeAttributes
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /l3GETSRTopologyNodeAttributes
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  l3GETSRTopologyNodeAttributes(network, node, callback) {
    const meth = 'adapter-l3GETSRTopologyNodeAttributes';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'l3GETSRTopologyNodeAttributes', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['l3GETSRTopologyNodeAttributes'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function l3GETSRTopologyLinkAttributes
   * @pronghornType method
   * @name l3GETSRTopologyLinkAttributes
   * @summary l3GETSRTopologyLinkAttributes
   *
   * @param {string} network - network param
   * @param {string} link - link param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /l3GETSRTopologyLinkAttributes
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  l3GETSRTopologyLinkAttributes(network, link, callback) {
    const meth = 'adapter-l3GETSRTopologyLinkAttributes';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (link === undefined || link === null || link === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['link'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `ietf-network-topology:link=${link}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFL3Model', 'l3GETSRTopologyLinkAttributes', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['l3GETSRTopologyLinkAttributes'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSAPNetwork
   * @pronghornType method
   * @name getSAPNetwork
   * @summary gETSAPNetwork
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getSAPNetwork
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSAPNetwork(callback) {
    const meth = 'adapter-getSAPNetwork';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFSAPTopology', 'getSAPNetwork', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSAPNetwork'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIETFNetworkFromSpecificNode
   * @pronghornType method
   * @name getIETFNetworkFromSpecificNode
   * @summary getIETFNetworkFromSpecificNode
   *
   * @param {string} node - node param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getIETFNetworkFromSpecificNode
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIETFNetworkFromSpecificNode(node, callback) {
    const meth = 'adapter-getIETFNetworkFromSpecificNode';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`node=${node}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFSAPTopology', 'getIETFNetworkFromSpecificNode', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIETFNetworkFromSpecificNode'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSAPsOnASpecificNodeOfSpecificServiceType
   * @pronghornType method
   * @name getSAPsOnASpecificNodeOfSpecificServiceType
   * @summary getSAPsOnASpecificNodeOfSpecificServiceType
   *
   * @param {string} network - network param
   * @param {string} node - node param
   * @param {string} service - service param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSAPsOnASpecificNodeOfSpecificServiceType
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSAPsOnASpecificNodeOfSpecificServiceType(network, node, service, callback) {
    const meth = 'adapter-getSAPsOnASpecificNodeOfSpecificServiceType';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (network === undefined || network === null || network === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['network'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (node === undefined || node === null || node === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['node'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (service === undefined || service === null || service === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['service'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network=${network}`, `node=${node}`, `ietf-sap-ntw:service=${service}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IETFSAPTopology', 'getSAPsOnASpecificNodeOfSpecificServiceType', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSAPsOnASpecificNodeOfSpecificServiceType'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIETFMappingFiles
   * @pronghornType method
   * @name getIETFMappingFiles
   * @summary gETIETFMappingFiles
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getIETFMappingFiles
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIETFMappingFiles(callback) {
    const meth = 'adapter-getIETFMappingFiles';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UploadMappingFiles', 'getIETFMappingFiles', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIETFMappingFiles'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function loadIETFMappingFiles
   * @pronghornType method
   * @name loadIETFMappingFiles
   * @summary loadIETFMappingFiles
   *
   * @param {string} nspPluginId - nspPluginId param
   * @param {string} file - file param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /loadIETFMappingFiles
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  loadIETFMappingFiles(nspPluginId, file, callback) {
    const meth = 'adapter-loadIETFMappingFiles';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (nspPluginId === undefined || nspPluginId === null || nspPluginId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['nspPluginId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (file === undefined || file === null || file === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['file'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { nspPluginId };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = { file };

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UploadMappingFiles', 'loadIETFMappingFiles', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['loadIETFMappingFiles'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createMappingPolicy
   * @pronghornType method
   * @name createMappingPolicy
   * @summary createMappingPolicy
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createMappingPolicy
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createMappingPolicy(body, callback) {
    const meth = 'adapter-createMappingPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RouterNECorrelationMappingService', 'createMappingPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createMappingPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getCorrelationPolicy
   * @pronghornType method
   * @name getCorrelationPolicy
   * @summary getCorrelationPolicy
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getCorrelationPolicy
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCorrelationPolicy(callback) {
    const meth = 'adapter-getCorrelationPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RouterNECorrelationMappingService', 'getCorrelationPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCorrelationPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function updateMappingPolicy
   * @pronghornType method
   * @name updateMappingPolicy
   * @summary updateMappingPolicy
   *
   * @param {string} routerNeMapping - routerNeMapping param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /updateMappingPolicy
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateMappingPolicy(routerNeMapping, body, callback) {
    const meth = 'adapter-updateMappingPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (routerNeMapping === undefined || routerNeMapping === null || routerNeMapping === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['routerNeMapping'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`router-ne-mapping=${routerNeMapping}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RouterNECorrelationMappingService', 'updateMappingPolicy', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateMappingPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificMappingPolicy
   * @pronghornType method
   * @name getSpecificMappingPolicy
   * @summary getSpecificMappingPolicy
   *
   * @param {string} routerNeMapping - routerNeMapping param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificMappingPolicy
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificMappingPolicy(routerNeMapping, callback) {
    const meth = 'adapter-getSpecificMappingPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (routerNeMapping === undefined || routerNeMapping === null || routerNeMapping === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['routerNeMapping'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`router-ne-mapping=${routerNeMapping}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RouterNECorrelationMappingService', 'getSpecificMappingPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificMappingPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteAllPoliciesOnARouter
   * @pronghornType method
   * @name deleteAllPoliciesOnARouter
   * @summary deleteAllPoliciesOnARouter
   *
   * @param {string} routerNeMapping - routerNeMapping param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteAllPoliciesOnARouter
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteAllPoliciesOnARouter(routerNeMapping, callback) {
    const meth = 'adapter-deleteAllPoliciesOnARouter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (routerNeMapping === undefined || routerNeMapping === null || routerNeMapping === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['routerNeMapping'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`router-ne-mapping=${routerNeMapping}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RouterNECorrelationMappingService', 'deleteAllPoliciesOnARouter', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteAllPoliciesOnARouter'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getRouterNeMapping
   * @pronghornType method
   * @name getRouterNeMapping
   * @summary getRouter-Ne-Mapping
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getRouterNeMapping
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRouterNeMapping(callback) {
    const meth = 'adapter-getRouterNeMapping';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RouterNECorrelationMappingService', 'getRouterNeMapping', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRouterNeMapping'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteOnePolicyOfRouter
   * @pronghornType method
   * @name deleteOnePolicyOfRouter
   * @summary deleteOnePolicyOfRouter
   *
   * @param {string} routerNeMapping - routerNeMapping param
   * @param {string} routerInfos - routerInfos param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteOnePolicyOfRouter
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteOnePolicyOfRouter(routerNeMapping, routerInfos, callback) {
    const meth = 'adapter-deleteOnePolicyOfRouter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (routerNeMapping === undefined || routerNeMapping === null || routerNeMapping === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['routerNeMapping'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (routerInfos === undefined || routerInfos === null || routerInfos === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['routerInfos'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`router-ne-mapping=${routerNeMapping}`, `router-infos=${routerInfos}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RouterNECorrelationMappingService', 'deleteOnePolicyOfRouter', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteOnePolicyOfRouter'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIndicatorAgeoutPolicySettings
   * @pronghornType method
   * @name getIndicatorAgeoutPolicySettings
   * @summary getIndicatorAgeout-PolicySettings
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getIndicatorAgeoutPolicySettings
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIndicatorAgeoutPolicySettings(callback) {
    const meth = 'adapter-getIndicatorAgeoutPolicySettings';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DataTablesRetention', 'getIndicatorAgeoutPolicySettings', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIndicatorAgeoutPolicySettings'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function updateTheRetentionTimeForIndicators
   * @pronghornType method
   * @name updateTheRetentionTimeForIndicators
   * @summary updateTheRetentionTimeForIndicators
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /updateTheRetentionTimeForIndicators
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateTheRetentionTimeForIndicators(body, callback) {
    const meth = 'adapter-updateTheRetentionTimeForIndicators';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DataTablesRetention', 'updateTheRetentionTimeForIndicators', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateTheRetentionTimeForIndicators'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getBaselineAgeoutPolicySettings
   * @pronghornType method
   * @name getBaselineAgeoutPolicySettings
   * @summary getBaselineAgeout-PolicySettings
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getBaselineAgeoutPolicySettings
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getBaselineAgeoutPolicySettings(callback) {
    const meth = 'adapter-getBaselineAgeoutPolicySettings';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DataTablesRetention', 'getBaselineAgeoutPolicySettings', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getBaselineAgeoutPolicySettings'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function updateTheRetentionTimeForBaseline
   * @pronghornType method
   * @name updateTheRetentionTimeForBaseline
   * @summary updateTheRetentionTimeForBaseline
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /updateTheRetentionTimeForBaseline
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateTheRetentionTimeForBaseline(body, callback) {
    const meth = 'adapter-updateTheRetentionTimeForBaseline';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DataTablesRetention', 'updateTheRetentionTimeForBaseline', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateTheRetentionTimeForBaseline'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function avgCPUAllNodesAllActions
   * @pronghornType method
   * @name avgCPUAllNodesAllActions
   * @summary avgCPUAllNodes-AllActions
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /avgCPUAllNodesAllActions
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  avgCPUAllNodesAllActions(body, callback) {
    const meth = 'adapter-avgCPUAllNodesAllActions';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorTemplates', 'avgCPUAllNodesAllActions', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['avgCPUAllNodesAllActions'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getAllIndicatorTemplates
   * @pronghornType method
   * @name getAllIndicatorTemplates
   * @summary getAllIndicatorTemplates
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getAllIndicatorTemplates
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllIndicatorTemplates(callback) {
    const meth = 'adapter-getAllIndicatorTemplates';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorTemplates', 'getAllIndicatorTemplates', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllIndicatorTemplates'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function uPDATEIndicatorTemplate
   * @pronghornType method
   * @name uPDATEIndicatorTemplate
   * @summary uPDATEIndicatorTemplate
   *
   * @param {string} template - template param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /uPDATEIndicatorTemplate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  uPDATEIndicatorTemplate(template, body, callback) {
    const meth = 'adapter-uPDATEIndicatorTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorTemplates', 'uPDATEIndicatorTemplate', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['uPDATEIndicatorTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteIndicatorTemplate
   * @pronghornType method
   * @name deleteIndicatorTemplate
   * @summary deleteIndicatorTemplate
   *
   * @param {string} template - template param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteIndicatorTemplate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteIndicatorTemplate(template, callback) {
    const meth = 'adapter-deleteIndicatorTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorTemplates', 'deleteIndicatorTemplate', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteIndicatorTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificIndicatorTemplate
   * @pronghornType method
   * @name getSpecificIndicatorTemplate
   * @summary getSpecificIndicatorTemplate
   *
   * @param {string} template - template param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificIndicatorTemplate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificIndicatorTemplate(template, callback) {
    const meth = 'adapter-getSpecificIndicatorTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorTemplates', 'getSpecificIndicatorTemplate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificIndicatorTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postavgCPUAllNodesAllActions
   * @pronghornType method
   * @name postavgCPUAllNodesAllActions
   * @summary avgCPUAllNodes-AllActions
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postavgCPUAllNodesAllActions
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postavgCPUAllNodesAllActions(body, callback) {
    const meth = 'adapter-postavgCPUAllNodesAllActions';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorRules', 'postavgCPUAllNodesAllActions', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postavgCPUAllNodesAllActions'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getAllIndicatorRules
   * @pronghornType method
   * @name getAllIndicatorRules
   * @summary getAllIndicatorRules
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getAllIndicatorRules
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllIndicatorRules(callback) {
    const meth = 'adapter-getAllIndicatorRules';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorRules', 'getAllIndicatorRules', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllIndicatorRules'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function updateIndicatorRule
   * @pronghornType method
   * @name updateIndicatorRule
   * @summary updateIndicatorRule
   *
   * @param {string} rule - rule param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /updateIndicatorRule
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateIndicatorRule(rule, body, callback) {
    const meth = 'adapter-updateIndicatorRule';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (rule === undefined || rule === null || rule === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['rule'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`rule=${rule}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorRules', 'updateIndicatorRule', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateIndicatorRule'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteIndicatorRule
   * @pronghornType method
   * @name deleteIndicatorRule
   * @summary deleteIndicatorRule
   *
   * @param {string} rule - rule param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteIndicatorRule
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteIndicatorRule(rule, callback) {
    const meth = 'adapter-deleteIndicatorRule';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (rule === undefined || rule === null || rule === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['rule'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`rule=${rule}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorRules', 'deleteIndicatorRule', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteIndicatorRule'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificIndicatorRule
   * @pronghornType method
   * @name getSpecificIndicatorRule
   * @summary getSpecificIndicatorRule
   *
   * @param {string} rule - rule param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificIndicatorRule
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificIndicatorRule(rule, callback) {
    const meth = 'adapter-getSpecificIndicatorRule';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (rule === undefined || rule === null || rule === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['rule'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`rule=${rule}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IndicatorRules', 'getSpecificIndicatorRule', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificIndicatorRule'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createSubscription
   * @pronghornType method
   * @name createSubscription
   * @summary createSubscription
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createSubscription
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createSubscription(body, callback) {
    const meth = 'adapter-createSubscription';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'createSubscription', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createSubscription'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createBaseline
   * @pronghornType method
   * @name createBaseline
   * @summary createBaseline
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createBaseline
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createBaseline(body, callback) {
    const meth = 'adapter-createBaseline';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'createBaseline', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createBaseline'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getBaseline
   * @pronghornType method
   * @name getBaseline
   * @summary getBaseline
   *
   * @param {string} baseline - baseline param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getBaseline
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getBaseline(baseline, callback) {
    const meth = 'adapter-getBaseline';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (baseline === undefined || baseline === null || baseline === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baseline'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`baseline=${baseline}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'getBaseline', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getBaseline'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createBaselineDetector
   * @pronghornType method
   * @name createBaselineDetector
   * @summary createBaselineDetector
   *
   * @param {string} baseline - baseline param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createBaselineDetector
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createBaselineDetector(baseline, body, callback) {
    const meth = 'adapter-createBaselineDetector';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (baseline === undefined || baseline === null || baseline === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baseline'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`baseline=${baseline}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'createBaselineDetector', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createBaselineDetector'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteBaseline
   * @pronghornType method
   * @name deleteBaseline
   * @summary deleteBaseline
   *
   * @param {string} baseline - baseline param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteBaseline
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteBaseline(baseline, callback) {
    const meth = 'adapter-deleteBaseline';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (baseline === undefined || baseline === null || baseline === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baseline'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`baseline=${baseline}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'deleteBaseline', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteBaseline'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getBaselineDetector
   * @pronghornType method
   * @name getBaselineDetector
   * @summary getBaselineDetector
   *
   * @param {string} baseline - baseline param
   * @param {string} baselineDetector - baselineDetector param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getBaselineDetector
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getBaselineDetector(baseline, baselineDetector, callback) {
    const meth = 'adapter-getBaselineDetector';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (baseline === undefined || baseline === null || baseline === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baseline'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (baselineDetector === undefined || baselineDetector === null || baselineDetector === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baselineDetector'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`baseline=${baseline}`, `baseline-detector=${baselineDetector}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'getBaselineDetector', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getBaselineDetector'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function patchBaselineDetector
   * @pronghornType method
   * @name patchBaselineDetector
   * @summary patchBaselineDetector
   *
   * @param {string} baseline - baseline param
   * @param {string} baselineDetector - baselineDetector param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /patchBaselineDetector
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  patchBaselineDetector(baseline, baselineDetector, body, callback) {
    const meth = 'adapter-patchBaselineDetector';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (baseline === undefined || baseline === null || baseline === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baseline'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (baselineDetector === undefined || baselineDetector === null || baselineDetector === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baselineDetector'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`baseline=${baseline}`, `baseline-detector=${baselineDetector}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'patchBaselineDetector', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['patchBaselineDetector'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteBaselineDetector
   * @pronghornType method
   * @name deleteBaselineDetector
   * @summary deleteBaselineDetector
   *
   * @param {string} baseline - baseline param
   * @param {string} baselineDetector - baselineDetector param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteBaselineDetector
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteBaselineDetector(baseline, baselineDetector, callback) {
    const meth = 'adapter-deleteBaselineDetector';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (baseline === undefined || baseline === null || baseline === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baseline'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (baselineDetector === undefined || baselineDetector === null || baselineDetector === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['baselineDetector'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`baseline=${baseline}`, `baseline-detector=${baselineDetector}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'deleteBaselineDetector', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteBaselineDetector'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteSubscription
   * @pronghornType method
   * @name deleteSubscription
   * @summary deleteSubscription
   *
   * @param {string} subscription - subscription param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteSubscription
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteSubscription(subscription, callback) {
    const meth = 'adapter-deleteSubscription';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (subscription === undefined || subscription === null || subscription === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subscription'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`subscription=${subscription}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'deleteSubscription', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteSubscription'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getAllBaselines
   * @pronghornType method
   * @name getAllBaselines
   * @summary getAllBaselines
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getAllBaselines
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllBaselines(callback) {
    const meth = 'adapter-getAllBaselines';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('BaselineOperationsRestconfAPI', 'getAllBaselines', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllBaselines'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function importIntentTypeFromIntentManager
   * @pronghornType method
   * @name importIntentTypeFromIntentManager
   * @summary importIntentTypeFromIntentManager
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /importIntentTypeFromIntentManager
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  importIntentTypeFromIntentManager(body, callback) {
    const meth = 'adapter-importIntentTypeFromIntentManager';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IntentTypeManagement', 'importIntentTypeFromIntentManager', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['importIntentTypeFromIntentManager'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIntentTypes
   * @pronghornType method
   * @name getIntentTypes
   * @summary getIntentTypes
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getIntentTypes
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIntentTypes(callback) {
    const meth = 'adapter-getIntentTypes';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IntentTypeManagement', 'getIntentTypes', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIntentTypes'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function removeIntentType
   * @pronghornType method
   * @name removeIntentType
   * @summary removeIntentType
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /removeIntentType
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  removeIntentType(body, callback) {
    const meth = 'adapter-removeIntentType';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IntentTypeManagement', 'removeIntentType', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['removeIntentType'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createTemplate
   * @pronghornType method
   * @name createTemplate
   * @summary createTemplate
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createTemplate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createTemplate(body, callback) {
    const meth = 'adapter-createTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationTemplates', 'createTemplate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getTemplates
   * @pronghornType method
   * @name getTemplates
   * @summary getTemplates
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getTemplates
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTemplates(callback) {
    const meth = 'adapter-getTemplates';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationTemplates', 'getTemplates', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTemplates'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function updateTemplateLifecycle
   * @pronghornType method
   * @name updateTemplateLifecycle
   * @summary updateTemplateLifecycle
   *
   * @param {string} template - template param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /updateTemplateLifecycle
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateTemplateLifecycle(template, body, callback) {
    const meth = 'adapter-updateTemplateLifecycle';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationTemplates', 'updateTemplateLifecycle', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateTemplateLifecycle'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteTemplate
   * @pronghornType method
   * @name deleteTemplate
   * @summary deleteTemplate
   *
   * @param {string} template - template param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteTemplate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteTemplate(template, callback) {
    const meth = 'adapter-deleteTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationTemplates', 'deleteTemplate', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createPortGroupDirectory
   * @pronghornType method
   * @name createPortGroupDirectory
   * @summary createPortGroupDirectory
   *
   * @param {string} category - category param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createPortGroupDirectory
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createPortGroupDirectory(category, body, callback) {
    const meth = 'adapter-createPortGroupDirectory';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (category === undefined || category === null || category === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['category'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { category };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'createPortGroupDirectory', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createPortGroupDirectory'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createPortGroup
   * @pronghornType method
   * @name createPortGroup
   * @summary createPortGroup
   *
   * @param {string} category - category param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createPortGroup
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createPortGroup(category, body, callback) {
    const meth = 'adapter-createPortGroup';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (category === undefined || category === null || category === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['category'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { category };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'createPortGroup', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createPortGroup'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getPortGroupFDN
   * @pronghornType method
   * @name getPortGroupFDN
   * @summary getPortGroupFDN
   *
   * @param {string} category - category param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getPortGroupFDN
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPortGroupFDN(category, callback) {
    const meth = 'adapter-getPortGroupFDN';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (category === undefined || category === null || category === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['category'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { category };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'getPortGroupFDN', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPortGroupFDN'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function createDeployment
   * @pronghornType method
   * @name createDeployment
   * @summary createDeployment
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /createDeployment
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createDeployment(body, callback) {
    const meth = 'adapter-createDeployment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'createDeployment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createDeployment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function updateDeploymentConfiguration
   * @pronghornType method
   * @name updateDeploymentConfiguration
   * @summary updateDeploymentConfiguration
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /updateDeploymentConfiguration
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateDeploymentConfiguration(body, callback) {
    const meth = 'adapter-updateDeploymentConfiguration';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'updateDeploymentConfiguration', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateDeploymentConfiguration'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function replaceDeployment
   * @pronghornType method
   * @name replaceDeployment
   * @summary replaceDeployment
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /replaceDeployment
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  replaceDeployment(body, callback) {
    const meth = 'adapter-replaceDeployment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'replaceDeployment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['replaceDeployment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getDeployments
   * @pronghornType method
   * @name getDeployments
   * @summary getDeployments
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getDeployments
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDeployments(callback) {
    const meth = 'adapter-getDeployments';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'getDeployments', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDeployments'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificDeployment
   * @pronghornType method
   * @name getSpecificDeployment
   * @summary getSpecificDeployment
   *
   * @param {string} deployment - deployment param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificDeployment
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificDeployment(deployment, callback) {
    const meth = 'adapter-getSpecificDeployment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deployment === undefined || deployment === null || deployment === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deployment'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`deployment=${deployment}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'getSpecificDeployment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificDeployment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteSingleDeployment
   * @pronghornType method
   * @name deleteSingleDeployment
   * @summary deleteSingleDeployment
   *
   * @param {string} deployment - deployment param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteSingleDeployment
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteSingleDeployment(deployment, callback) {
    const meth = 'adapter-deleteSingleDeployment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deployment === undefined || deployment === null || deployment === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deployment'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`deployment=${deployment}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'deleteSingleDeployment', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteSingleDeployment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteDeployments
   * @pronghornType method
   * @name deleteDeployments
   * @summary deleteDeployments
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteDeployments
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteDeployments(body, callback) {
    const meth = 'adapter-deleteDeployments';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigurationDeployments', 'deleteDeployments', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteDeployments'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function discoverDeployments
   * @pronghornType method
   * @name discoverDeployments
   * @summary discoverDeployments
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /discoverDeployments
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  discoverDeployments(body, callback) {
    const meth = 'adapter-discoverDeployments';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Brownfield', 'discoverDeployments', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['discoverDeployments'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function auditDeployment
   * @pronghornType method
   * @name auditDeployment
   * @summary auditDeployment
   *
   * @param {string} deployment - deployment param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /auditDeployment
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  auditDeployment(deployment, body, callback) {
    const meth = 'adapter-auditDeployment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deployment === undefined || deployment === null || deployment === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deployment'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`deployment=${deployment}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'auditDeployment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['auditDeployment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getAuditDetails
   * @pronghornType method
   * @name getAuditDetails
   * @summary getAuditDetails
   *
   * @param {string} deployment - deployment param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getAuditDetails
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAuditDetails(deployment, callback) {
    const meth = 'adapter-getAuditDetails';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deployment === undefined || deployment === null || deployment === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deployment'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`deployment=${deployment}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'getAuditDetails', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAuditDetails'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function alignConfigurationDeployment
   * @pronghornType method
   * @name alignConfigurationDeployment
   * @summary alignConfigurationDeployment
   *
   * @param {string} deployment - deployment param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /alignConfigurationDeployment
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  alignConfigurationDeployment(deployment, body, callback) {
    const meth = 'adapter-alignConfigurationDeployment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deployment === undefined || deployment === null || deployment === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deployment'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`deployment=${deployment}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'alignConfigurationDeployment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['alignConfigurationDeployment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function auditTemplate
   * @pronghornType method
   * @name auditTemplate
   * @summary auditTemplate
   *
   * @param {string} template - template param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /auditTemplate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  auditTemplate(template, body, callback) {
    const meth = 'adapter-auditTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'auditTemplate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['auditTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function checkAuditStatusCount
   * @pronghornType method
   * @name checkAuditStatusCount
   * @summary checkAuditStatusCount
   *
   * @param {string} template - template param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /checkAuditStatusCount
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  checkAuditStatusCount(template, body, callback) {
    const meth = 'adapter-checkAuditStatusCount';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'checkAuditStatusCount', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['checkAuditStatusCount'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function alignConfigurationTemplateAllDeployments
   * @pronghornType method
   * @name alignConfigurationTemplateAllDeployments
   * @summary alignConfigurationTemplateAllDeployments
   *
   * @param {string} template - template param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /alignConfigurationTemplateAllDeployments
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  alignConfigurationTemplateAllDeployments(template, body, callback) {
    const meth = 'adapter-alignConfigurationTemplateAllDeployments';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'alignConfigurationTemplateAllDeployments', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['alignConfigurationTemplateAllDeployments'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function alignConfigurationTemplateMisalignedDeployments
   * @pronghornType method
   * @name alignConfigurationTemplateMisalignedDeployments
   * @summary alignConfigurationTemplateMisalignedDeployments
   *
   * @param {string} template - template param
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /alignConfigurationTemplateMisalignedDeployments
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  alignConfigurationTemplateMisalignedDeployments(template, body, callback) {
    const meth = 'adapter-alignConfigurationTemplateMisalignedDeployments';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (template === undefined || template === null || template === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['template'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`template=${template}`];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'alignConfigurationTemplateMisalignedDeployments', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['alignConfigurationTemplateMisalignedDeployments'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function auditNodeDeployments
   * @pronghornType method
   * @name auditNodeDeployments
   * @summary auditNodeDeployments
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /auditNodeDeployments
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  auditNodeDeployments(body, callback) {
    const meth = 'adapter-auditNodeDeployments';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AuditAndAlignment', 'auditNodeDeployments', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['auditNodeDeployments'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function cloneTemplate
   * @pronghornType method
   * @name cloneTemplate
   * @summary cloneTemplate
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /cloneTemplate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  cloneTemplate(body, callback) {
    const meth = 'adapter-cloneTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TemplateMigration', 'cloneTemplate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['cloneTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function migrateDeployments
   * @pronghornType method
   * @name migrateDeployments
   * @summary migrateDeployments
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /migrateDeployments
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  migrateDeployments(body, callback) {
    const meth = 'adapter-migrateDeployments';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TemplateMigration', 'migrateDeployments', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['migrateDeployments'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getNE
   * @pronghornType method
   * @name getNE
   * @summary getNE
   *
   * @param {number} [depth] - Optional depth query parameter
   * @param {string} [fields] - Optional fields param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getNE
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNE(depth, fields, callback) {
    const meth = 'adapter-getNE';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { depth, fields };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getNE', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNE'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificNE
   * @pronghornType method
   * @name getSpecificNE
   * @summary getSpecificNE
   *
   * @param {string} networkElement - networkElement param
   * @param {number} [depth] - Optional depth query parameter
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificNE
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNE(networkElement, depth, callback) {
    const meth = 'adapter-getSpecificNE';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (networkElement === undefined || networkElement === null || networkElement === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['networkElement'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { depth };
    const queryParams = {};
    const pathVars = [`network-element=${networkElement}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getSpecificNE', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNE'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getShelf
   * @pronghornType method
   * @name getShelf
   * @summary getShelf
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getShelf
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getShelf(callback) {
    const meth = 'adapter-getShelf';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getShelf', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getShelf'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificShelf
   * @pronghornType method
   * @name getSpecificShelf
   * @summary getSpecificShelf
   *
   * @param {string} networkElement - networkElement param
   * @param {string} shelf - shelf param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificShelf
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificShelf(networkElement, shelf, callback) {
    const meth = 'adapter-getSpecificShelf';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (networkElement === undefined || networkElement === null || networkElement === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['networkElement'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (shelf === undefined || shelf === null || shelf === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['shelf'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network-element=${networkElement}`, `shelf=${shelf}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getSpecificShelf', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificShelf'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getCard
   * @pronghornType method
   * @name getCard
   * @summary getCard
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getCard
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCard(callback) {
    const meth = 'adapter-getCard';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getCard', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCard'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificNECards
   * @pronghornType method
   * @name getSpecificNECards
   * @summary getSpecificNECards
   *
   * @param {string} networkElement - networkElement param
   * @param {string} card - card param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificNECards
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNECards(networkElement, card, callback) {
    const meth = 'adapter-getSpecificNECards';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (networkElement === undefined || networkElement === null || networkElement === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['networkElement'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (card === undefined || card === null || card === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['card'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network-element=${networkElement}`, `card=${card}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getSpecificNECards', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNECards'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getPort
   * @pronghornType method
   * @name getPort
   * @summary getPort
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getPort
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPort(callback) {
    const meth = 'adapter-getPort';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getPort', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPort'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getPortFromSpecificNE
   * @pronghornType method
   * @name getPortFromSpecificNE
   * @summary getPortFromSpecificNE
   *
   * @param {string} networkElement - networkElement param
   * @param {string} port - port param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getPortFromSpecificNE
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPortFromSpecificNE(networkElement, port, callback) {
    const meth = 'adapter-getPortFromSpecificNE';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (networkElement === undefined || networkElement === null || networkElement === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['networkElement'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (port === undefined || port === null || port === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['port'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network-element=${networkElement}`, `port=${port}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getPortFromSpecificNE', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPortFromSpecificNE'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getPortFromSpecificNETransceiverDetails
   * @pronghornType method
   * @name getPortFromSpecificNETransceiverDetails
   * @summary getPortFromSpecificNETransceiverDetails
   *
   * @param {string} networkElement - networkElement param
   * @param {string} port - port param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getPortFromSpecificNETransceiverDetails
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPortFromSpecificNETransceiverDetails(networkElement, port, callback) {
    const meth = 'adapter-getPortFromSpecificNETransceiverDetails';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (networkElement === undefined || networkElement === null || networkElement === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['networkElement'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (port === undefined || port === null || port === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['port'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network-element=${networkElement}`, `port=${port}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getPortFromSpecificNETransceiverDetails', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPortFromSpecificNETransceiverDetails'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getLags
   * @pronghornType method
   * @name getLags
   * @summary getLags
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getLags
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getLags(callback) {
    const meth = 'adapter-getLags';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getLags', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getLags'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificNELag
   * @pronghornType method
   * @name getSpecificNELag
   * @summary getSpecificNELag
   *
   * @param {string} networkElement - networkElement param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificNELag
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNELag(networkElement, callback) {
    const meth = 'adapter-getSpecificNELag';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (networkElement === undefined || networkElement === null || networkElement === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['networkElement'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [`network-element=${networkElement}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getSpecificNELag', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNELag'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSpecificNELagWithFields
   * @pronghornType method
   * @name getSpecificNELagWithFields
   * @summary getSpecificNELagWithFields
   *
   * @param {string} fields - fields param
   * @param {string} networkElement - networkElement param
   * @param {string} lag - lag param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSpecificNELagWithFields
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNELagWithFields(fields, networkElement, lag, callback) {
    const meth = 'adapter-getSpecificNELagWithFields';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (fields === undefined || fields === null || fields === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['fields'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (networkElement === undefined || networkElement === null || networkElement === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['networkElement'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (lag === undefined || lag === null || lag === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['lag'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { fields };
    const queryParams = {};
    const pathVars = [`network-element=${networkElement}`, `lag=${lag}`];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getSpecificNELagWithFields', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNELagWithFields'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getRadio
   * @pronghornType method
   * @name getRadio
   * @summary getRadio
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getRadio
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRadio(callback) {
    const meth = 'adapter-getRadio';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkInventoryRestconfAPI', 'getRadio', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRadio'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }
}

module.exports = NokiaNspNetworkManagement;
