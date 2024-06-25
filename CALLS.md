## Using this Adapter

The `adapter.js` file contains the calls the adapter makes available to the rest of the Itential Platform. The API detailed for these calls should be available through JSDOC. The following is a brief summary of the calls.

### Generic Adapter Calls

These are adapter methods that IAP or you might use. There are some other methods not shown here that might be used for internal adapter functionality.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">connect()</td>
    <td style="padding:15px">This call is run when the Adapter is first loaded by he Itential Platform. It validates the properties have been provided correctly.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">healthCheck(callback)</td>
    <td style="padding:15px">This call ensures that the adapter can communicate with Adapter for Nokia NSP Network Infrastructure Management. The actual call that is used is defined in the adapter properties and .system entities action.json file.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">refreshProperties(properties)</td>
    <td style="padding:15px">This call provides the adapter the ability to accept property changes without having to restart the adapter.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">encryptProperty(property, technique, callback)</td>
    <td style="padding:15px">This call will take the provided property and technique, and return the property encrypted with the technique. This allows the property to be used in the adapterProps section for the credential password so that the password does not have to be in clear text. The adapter will decrypt the property as needed for communications with Adapter for Nokia NSP Network Infrastructure Management.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, callback)</td>
    <td style="padding:15px">This call provides the ability to update the adapter configuration from IAP - includes actions, schema, mockdata and other configurations.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapSuspendAdapter(mode, callback)</td>
    <td style="padding:15px">This call provides the ability to suspend the adapter and either have requests rejected or put into a queue to be processed after the adapter is resumed.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUnsuspendAdapter(callback)</td>
    <td style="padding:15px">This call provides the ability to resume a suspended adapter. Any requests in queue will be processed before new requests.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetAdapterQueue(callback)</td>
    <td style="padding:15px">This call will return the requests that are waiting in the queue if throttling is enabled.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapFindAdapterPath(apiPath, callback)</td>
    <td style="padding:15px">This call provides the ability to see if a particular API path is supported by the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapTroubleshootAdapter(props, persistFlag, adapter, callback)</td>
    <td style="padding:15px">This call can be used to check on the performance of the adapter - it checks connectivity, healthcheck and basic get calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterHealthcheck(adapter, callback)</td>
    <td style="padding:15px">This call will return the results of a healthcheck.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterConnectivity(callback)</td>
    <td style="padding:15px">This call will return the results of a connectivity check.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterBasicGet(callback)</td>
    <td style="padding:15px">This call will return the results of running basic get API calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapMoveAdapterEntitiesToDB(callback)</td>
    <td style="padding:15px">This call will push the adapter configuration from the entities directory into the Adapter or IAP Database.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapDeactivateTasks(tasks, callback)</td>
    <td style="padding:15px">This call provides the ability to remove tasks from the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapActivateTasks(tasks, callback)</td>
    <td style="padding:15px">This call provides the ability to add deactivated tasks back into the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This is an expanded Generic Call. The metadata object allows us to provide many new capabilities within the generic request.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call allows you to provide the path to have the adapter call. It is an easy way to incorporate paths that have not been built into the adapter yet.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call is the same as the genericAdapterRequest only it does not add a base_path or version to the call.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterLint(callback)</td>
    <td style="padding:15px">Runs lint on the addapter and provides the information back.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterTests(callback)</td>
    <td style="padding:15px">Runs baseunit and unit tests on the adapter and provides the information back.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetAdapterInventory(callback)</td>
    <td style="padding:15px">This call provides some inventory related information about the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
  
### Adapter Cache Calls

These are adapter methods that are used for adapter caching. If configured, the adapter will cache based on the interval provided. However, you can force a population of the cache manually as well.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">iapPopulateEntityCache(entityTypes, callback)</td>
    <td style="padding:15px">This call populates the adapter cache.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRetrieveEntitiesCache(entityType, options, callback)</td>
    <td style="padding:15px">This call retrieves the specific items from the adapter cache.</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
  
### Adapter Broker Calls

These are adapter methods that are used to integrate to IAP Brokers. This adapter currently supports the following broker calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">hasEntities(entityType, entityList, callback)</td>
    <td style="padding:15px">This call is utilized by the IAP Device Broker to determine if the adapter has a specific entity and item of the entity.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice(deviceName, callback)</td>
    <td style="padding:15px">This call returns the details of the requested device.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesFiltered(options, callback)</td>
    <td style="padding:15px">This call returns the list of devices that match the criteria provided in the options filter.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive(deviceName, callback)</td>
    <td style="padding:15px">This call returns whether the device status is active</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfig(deviceName, format, callback)</td>
    <td style="padding:15px">This call returns the configuration for the selected device.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetDeviceCount(callback)</td>
    <td style="padding:15px">This call returns the count of devices.</td>
    <td style="padding:15px">No</td>
  </tr>
</table>
<br>

### Specific Adapter Calls

Specific adapter calls are built based on the API of the nokia_nsp_network_management. The Adapter Builder creates the proper method comments for generating JS-DOC for the adapter. This is the best way to get information on the calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Path</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkInterfaces(network, node, callback)</td>
    <td style="padding:15px">retrieveNetworkInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkInterfacesConfig(network, node, callback)</td>
    <td style="padding:15px">retrieveNetworkInterfacesConfig</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface/config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkSubInterfaces(network, node, callback)</td>
    <td style="padding:15px">retrieveNetworkSubInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface/subinterfaces/subinterface?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkSubInterfacesConfig(network, node, subinterface, callback)</td>
    <td style="padding:15px">retrieveNetworkSubInterfacesConfig</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface/subinterfaces/{pathv3}/config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkSubInterfacesState(network, node, subinterface, callback)</td>
    <td style="padding:15px">retrieveNetworkSubInterfacesState</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface/subinterfaces/{pathv3}/state?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkSubInterfacesIPv4Addresses(network, node, interfaceParam, subinterface, callback)</td>
    <td style="padding:15px">retrieveNetworkSubInterfacesIPv4Addresses</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/{pathv3}/subinterfaces/{pathv4}/openconfig-if-ip:ipv4/addresses/address?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkSubInterfacesIPv6Addresses(network, node, subinterface, callback)</td>
    <td style="padding:15px">retrieveNetworkSubInterfacesIPv6Addresses</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface/subinterfaces/{pathv3}/openconfig-if-ip:ipv6/addresses/address?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkInterfacesUnnumbered(network, node, subinterface, callback)</td>
    <td style="padding:15px">retrieveNetworkInterfacesUnnumbered</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface/subinterfaces/{pathv3}/openconfig-if-ip:ipv4/unnumbered?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkInterfacesUnnumberedIntf(network, node, subinterface, callback)</td>
    <td style="padding:15px">retrieveNetworkInterfacesUnnumberedIntf</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/ne-interfaces/logical-interfaces/interfaces-root/openconfig-interfaces:interfaces/interface/subinterfaces/{pathv3}/openconfig-if-ip:ipv4/unnumbered/interface-ref?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveNetworkInstance(network, node, callback)</td>
    <td style="padding:15px">retrieveNetworkInstance</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ne-management-nm:commissioning-configs/protocols-config/protocol-root/openconfig-network-instance:network-instances/network-instance?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveResyncPolicyNodeVersionEntity(resyncPolicy, node, version, callback)</td>
    <td style="padding:15px">retrieveResyncPolicyNodeVersionEntity</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-admin-resync:resync-policies/mdm/{pathv1}/{pathv2}/{pathv3}/entity?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createUsingIntent(body, callback)</td>
    <td style="padding:15px">createUsingIntent</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ibn:ibn?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">synchronizeIntent(intent, callback)</td>
    <td style="padding:15px">synchronizeIntent</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ibn:ibn/{pathv1}/synchronize?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIntent(intent, callback)</td>
    <td style="padding:15px">getIntent</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ibn:ibn/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyIntent(intent, body, callback)</td>
    <td style="padding:15px">modifyIntent</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ibn:ibn/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteIntent(intent, callback)</td>
    <td style="padding:15px">deleteIntent</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ibn:ibn/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getZTPListFromDeviceAdministrator(callback)</td>
    <td style="padding:15px">getZTPListFromDeviceAdministrator</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-ne-control:ne-control/autodiscovery-ne?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">devAdminCreateAutodiscoveryNe(body, callback)</td>
    <td style="padding:15px">devAdmin-CreateAutodiscoveryNe</td>
    <td style="padding:15px">{base_path}/{version}/:8545/restconf/data/nsp-ne-control:ne-control?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">devAdminUpdateAutodiscoveryNe(autodiscoveryNe, body, callback)</td>
    <td style="padding:15px">devAdmin-UpdateAutodiscovery-Ne</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-ne-control:ne-control/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">devAdminDeleteAutodiscoverNe(autodiscoveryNe, callback)</td>
    <td style="padding:15px">devAdmin-DeleteAutodiscover-Ne</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-ne-control:ne-control/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createIPv4AddressPool(body, callback)</td>
    <td style="padding:15px">createIPv4AddressPool</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-resource-pool:resource-pools?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIPv4AddressPool(ipResourcePools, callback)</td>
    <td style="padding:15px">getIPv4AddressPool</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-resource-pool:resource-pools/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">obtainValueFromPool(ipResourcePools, body, callback)</td>
    <td style="padding:15px">obtainValueFromPool</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-resource-pool:resource-pools/{pathv1}/obtain-value-from-pool?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">nspInventoryFindWithFilter(body, callback)</td>
    <td style="padding:15px">nspInventoryFindWithFilter</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-inventory:find?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveResyncPolicy(callback)</td>
    <td style="padding:15px">retrieveResyncPolicy</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-admin-resync:resync-policies/mdm/resync-policy?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveResyncPolicyNEAndVersionSpecific(resyncPolicy, node, version, callback)</td>
    <td style="padding:15px">retrieveResyncPolicy-NEAndVersionSpecific</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-admin-resync:resync-policies/mdm/{pathv1}/{pathv2}/{pathv3}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">retrieveResyncPollingPolicyNESpecific(resyncPolicy, node, callback)</td>
    <td style="padding:15px">retrieveResync(Polling)Policy-NESpecific</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-admin-resync:resync-policies/mdm/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">enableResyncPollingPolicy(resyncPolicy, node, version, entity, body, callback)</td>
    <td style="padding:15px">enableResync(Polling)Policy</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-admin-resync:resync-policies/mdm/{pathv1}/{pathv2}/{pathv3}/{pathv4}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getL2TopologyLinks(network, callback)</td>
    <td style="padding:15px">gETL2TopologyLinks</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/ietf-network-topology:link?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getL2TopologyAttributes(network, callback)</td>
    <td style="padding:15px">gETL2TopologyAttributes</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/ietf-l2-topology:l2-topology-attributes?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getL2TopologyNodeTerminationPoints(network, node, callback)</td>
    <td style="padding:15px">gETL2TopologyNodeTerminationPoints</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ietf-network-topology:termination-point?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNetwork(network, callback)</td>
    <td style="padding:15px">gETSpecificNetwork</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSupportingNetwork(network, callback)</td>
    <td style="padding:15px">gETSupportingNetwork</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/supporting-network?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkType(network, callback)</td>
    <td style="padding:15px">gETNetworkType</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/network-types?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetwork(callback)</td>
    <td style="padding:15px">gETNetwork</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/network?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getL3TopologyAttribute(network, callback)</td>
    <td style="padding:15px">gETL3TopologyAttribute</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/ietf-l3-unicast-topology:l3-topology-attributes?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllNodesInANetwork(network, callback)</td>
    <td style="padding:15px">gETAllNodesInANetwork</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/node?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNodeInANetwork(network, node, callback)</td>
    <td style="padding:15px">getSpecificNodeInANetwork</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificLinkInANetwork(network, link, callback)</td>
    <td style="padding:15px">getSpecificLinkInANetwork</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSupportingLink(network, link, callback)</td>
    <td style="padding:15px">getSupportingLink</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/supporting-link?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificTerminationPointsOfANode(network, node, terminationPoint, callback)</td>
    <td style="padding:15px">gETSpecificTerminationPointsOfANode</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/{pathv3}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSupportingTerminationPoint(network, node, terminationPoint, callback)</td>
    <td style="padding:15px">gETSupportingTerminationPoint</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/{pathv3}/supporting-termination-point?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">l3GETSRTopologyNodeAttributes(network, node, callback)</td>
    <td style="padding:15px">l3GETSRTopologyNodeAttributes</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ietf-l3-unicast-topology:l3-node-attributes/ietf-sr-mpls-topology:sr-mpls?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">l3GETSRTopologyLinkAttributes(network, link, callback)</td>
    <td style="padding:15px">l3GETSRTopologyLinkAttributes</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/ietf-l3-unicast-topology:l3-link-attributes/ietf-sr-mpls-topology:sr-mpls?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSAPNetwork(callback)</td>
    <td style="padding:15px">gETSAPNetwork</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/network/network-types/ietf-sap-ntw:sap-network?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIETFNetworkFromSpecificNode(node, callback)</td>
    <td style="padding:15px">getIETFNetworkFromSpecificNode</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/network/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSAPsOnASpecificNodeOfSpecificServiceType(network, node, service, callback)</td>
    <td style="padding:15px">getSAPsOnASpecificNodeOfSpecificServiceType</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/ietf-network:networks/{pathv1}/{pathv2}/{pathv3}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIETFMappingFiles(callback)</td>
    <td style="padding:15px">gETIETFMappingFiles</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-yang-mapping-converter:nsp-yang-mapping-converter?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">loadIETFMappingFiles(nspPluginId, file, callback)</td>
    <td style="padding:15px">loadIETFMappingFiles</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-yang-mapping-converter:nsp-yang-mapping-converter/uploadFile?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createMappingPolicy(body, callback)</td>
    <td style="padding:15px">createMappingPolicy</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment-templates:correlation-policy?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCorrelationPolicy(callback)</td>
    <td style="padding:15px">getCorrelationPolicy</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment-templates:correlation-policy?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateMappingPolicy(routerNeMapping, body, callback)</td>
    <td style="padding:15px">updateMappingPolicy</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment-templates:correlation-policy/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificMappingPolicy(routerNeMapping, callback)</td>
    <td style="padding:15px">getSpecificMappingPolicy</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment-templates:correlation-policy/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAllPoliciesOnARouter(routerNeMapping, callback)</td>
    <td style="padding:15px">deleteAllPoliciesOnARouter</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment-templates:correlation-policy/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRouterNeMapping(callback)</td>
    <td style="padding:15px">getRouter-Ne-Mapping</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment-templates:correlation-policy/router-ne-mapping?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteOnePolicyOfRouter(routerNeMapping, routerInfos, callback)</td>
    <td style="padding:15px">deleteOnePolicyOfRouter</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment-templates:correlation-policy/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIndicatorAgeoutPolicySettings(callback)</td>
    <td style="padding:15px">getIndicatorAgeout-PolicySettings</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/indicators-admin:/ageout-policies/ageout-policy?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateTheRetentionTimeForIndicators(body, callback)</td>
    <td style="padding:15px">updateTheRetentionTimeForIndicators</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/indicators-admin:/ageout-policies/ageout-policy?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getBaselineAgeoutPolicySettings(callback)</td>
    <td style="padding:15px">getBaselineAgeout-PolicySettings</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/rtanalytics-admin:/ageout-policies/ageout-policy?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateTheRetentionTimeForBaseline(body, callback)</td>
    <td style="padding:15px">updateTheRetentionTimeForBaseline</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/rtanalytics-admin:/ageout-policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">avgCPUAllNodesAllActions(body, callback)</td>
    <td style="padding:15px">avgCPUAllNodes-AllActions</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-templates?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllIndicatorTemplates(callback)</td>
    <td style="padding:15px">getAllIndicatorTemplates</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-templates?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">uPDATEIndicatorTemplate(template, body, callback)</td>
    <td style="padding:15px">uPDATEIndicatorTemplate</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-templates/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteIndicatorTemplate(template, callback)</td>
    <td style="padding:15px">deleteIndicatorTemplate</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-templates/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificIndicatorTemplate(template, callback)</td>
    <td style="padding:15px">getSpecificIndicatorTemplate</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-templates/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postavgCPUAllNodesAllActions(body, callback)</td>
    <td style="padding:15px">avgCPUAllNodes-AllActions</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllIndicatorRules(callback)</td>
    <td style="padding:15px">getAllIndicatorRules</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateIndicatorRule(rule, body, callback)</td>
    <td style="padding:15px">updateIndicatorRule</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-rules/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteIndicatorRule(rule, callback)</td>
    <td style="padding:15px">deleteIndicatorRule</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-rules/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificIndicatorRule(rule, callback)</td>
    <td style="padding:15px">getSpecificIndicatorRule</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-indicator:rta-indicator-rules/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createSubscription(body, callback)</td>
    <td style="padding:15px">createSubscription</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/md-subscription:/subscriptions/subscription?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createBaseline(body, callback)</td>
    <td style="padding:15px">createBaseline</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:baselines?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getBaseline(baseline, callback)</td>
    <td style="padding:15px">getBaseline</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:baselines/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createBaselineDetector(baseline, body, callback)</td>
    <td style="padding:15px">createBaselineDetector</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:baselines/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteBaseline(baseline, callback)</td>
    <td style="padding:15px">deleteBaseline</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:baselines/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getBaselineDetector(baseline, baselineDetector, callback)</td>
    <td style="padding:15px">getBaselineDetector</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:baselines/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">patchBaselineDetector(baseline, baselineDetector, body, callback)</td>
    <td style="padding:15px">patchBaselineDetector</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:baselines/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteBaselineDetector(baseline, baselineDetector, callback)</td>
    <td style="padding:15px">deleteBaselineDetector</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:baselines/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteSubscription(subscription, callback)</td>
    <td style="padding:15px">deleteSubscription</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/md-subscription:/subscriptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllBaselines(callback)</td>
    <td style="padding:15px">getAllBaselines</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-rt-analytics:/baselines/baseline?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">importIntentTypeFromIntentManager(body, callback)</td>
    <td style="padding:15px">importIntentTypeFromIntentManager</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:import-intent-types?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIntentTypes(callback)</td>
    <td style="padding:15px">getIntentTypes</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/imported-intent-types?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">removeIntentType(body, callback)</td>
    <td style="padding:15px">removeIntentType</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:remove-intent-type?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createTemplate(body, callback)</td>
    <td style="padding:15px">createTemplate</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTemplates(callback)</td>
    <td style="padding:15px">getTemplates</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateTemplateLifecycle(template, body, callback)</td>
    <td style="padding:15px">updateTemplateLifecycle</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteTemplate(template, callback)</td>
    <td style="padding:15px">deleteTemplate</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createPortGroupDirectory(category, body, callback)</td>
    <td style="padding:15px">createPortGroupDirectory</td>
    <td style="padding:15px">{base_path}/{version}/group-manager/rest/api/v1/groupDirectories?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createPortGroup(category, body, callback)</td>
    <td style="padding:15px">createPortGroup</td>
    <td style="padding:15px">{base_path}/{version}/group-manager/rest/api/v1/groups?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPortGroupFDN(category, callback)</td>
    <td style="padding:15px">getPortGroupFDN</td>
    <td style="padding:15px">{base_path}/{version}/group-manager/rest/api/v1/groups/name/AccessPorts?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createDeployment(body, callback)</td>
    <td style="padding:15px">createDeployment</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:create-deployments?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateDeploymentConfiguration(body, callback)</td>
    <td style="padding:15px">updateDeploymentConfiguration</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:update-deployments?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">replaceDeployment(body, callback)</td>
    <td style="padding:15px">replaceDeployment</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:replace-deployment?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDeployments(callback)</td>
    <td style="padding:15px">getDeployments</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/deployments?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificDeployment(deployment, callback)</td>
    <td style="padding:15px">getSpecificDeployment</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/deployments/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteSingleDeployment(deployment, callback)</td>
    <td style="padding:15px">deleteSingleDeployment</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/deployments/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteDeployments(body, callback)</td>
    <td style="padding:15px">deleteDeployments</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:delete-deployments?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">discoverDeployments(body, callback)</td>
    <td style="padding:15px">discoverDeployments</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:discover-deployments?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">auditDeployment(deployment, body, callback)</td>
    <td style="padding:15px">auditDeployment</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/deployments/{pathv1}/audit?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAuditDetails(deployment, callback)</td>
    <td style="padding:15px">getAuditDetails</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/deployments/{pathv1}/audit-details?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">alignConfigurationDeployment(deployment, body, callback)</td>
    <td style="padding:15px">alignConfigurationDeployment</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/deployments/{pathv1}/align-config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">auditTemplate(template, body, callback)</td>
    <td style="padding:15px">auditTemplate</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates/{pathv1}/audit?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">checkAuditStatusCount(template, body, callback)</td>
    <td style="padding:15px">checkAuditStatusCount</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates/{pathv1}/deployment-count-by-status?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">alignConfigurationTemplateAllDeployments(template, body, callback)</td>
    <td style="padding:15px">alignConfigurationTemplateAllDeployments</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates/{pathv1}/align-config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">alignConfigurationTemplateMisalignedDeployments(template, body, callback)</td>
    <td style="padding:15px">alignConfigurationTemplateMisalignedDeployments</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-icm:icm/templates/{pathv1}/align-misaligned-config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">auditNodeDeployments(body, callback)</td>
    <td style="padding:15px">auditNodeDeployments</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:ne-audit-align?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">cloneTemplate(body, callback)</td>
    <td style="padding:15px">cloneTemplate</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:clone-template?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">migrateDeployments(body, callback)</td>
    <td style="padding:15px">migrateDeployments</td>
    <td style="padding:15px">{base_path}/{version}/restconf/operations/nsp-icm:migrate-deployments?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNE(depth, fields, callback)</td>
    <td style="padding:15px">getNE</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/network-element?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNE(networkElement, depth, callback)</td>
    <td style="padding:15px">getSpecificNE</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getShelf(callback)</td>
    <td style="padding:15px">getShelf</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/network-element/hardware-component/shelf?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificShelf(networkElement, shelf, callback)</td>
    <td style="padding:15px">getSpecificShelf</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/{pathv1}/hardware-component/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCard(callback)</td>
    <td style="padding:15px">getCard</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/network-element/hardware-component/card?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNECards(networkElement, card, callback)</td>
    <td style="padding:15px">getSpecificNECards</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/{pathv1}/hardware-component/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPort(callback)</td>
    <td style="padding:15px">getPort</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/network-element/hardware-component/port?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPortFromSpecificNE(networkElement, port, callback)</td>
    <td style="padding:15px">getPortFromSpecificNE</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/{pathv1}/hardware-component/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPortFromSpecificNETransceiverDetails(networkElement, port, callback)</td>
    <td style="padding:15px">getPortFromSpecificNETransceiverDetails</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/{pathv1}/hardware-component/{pathv2}/transceiver-details?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLags(callback)</td>
    <td style="padding:15px">getLags</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:/network/network-element/lag?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNELag(networkElement, callback)</td>
    <td style="padding:15px">getSpecificNELag</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/{pathv1}/lag?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNELagWithFields(fields, networkElement, lag, callback)</td>
    <td style="padding:15px">getSpecificNELagWithFields</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:network/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRadio(callback)</td>
    <td style="padding:15px">getRadio</td>
    <td style="padding:15px">{base_path}/{version}/restconf/data/nsp-equipment:/network/network-element/hardware-component/radio?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
