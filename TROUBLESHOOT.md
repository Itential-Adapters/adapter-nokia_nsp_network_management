## Troubleshoot

Run `npm run troubleshoot` to start the interactive troubleshooting process. The command allows you to verify and update connection, authentication as well as healthcheck configuration. After that it will test these properties by sending HTTP request to the endpoint. If the tests pass, it will persist these changes into IAP.

You also have the option to run individual commands to perform specific test:

- `npm run healthcheck` will perform a healthcheck request of with current setting.
- `npm run basicget` will perform some non-parameter GET request with current setting.
- `npm run connectivity` will perform networking diagnostics of the adatper endpoint.

### Connectivity Issues

1. You can run the adapter troubleshooting script which will check connectivity, run the healthcheck and run basic get calls.

```bash
npm run troubleshoot
```

2. Verify the adapter properties are set up correctly.

```text
Go into the Itential Platform GUI and verify/update the properties
```

3. Verify there is connectivity between the Itential Platform Server and nokia_nsp_network_management Server.

```text
ping the ip address of nokia_nsp_network_management server
try telnet to the ip address port of nokia_nsp_network_management
execute a curl command to the other system
```

4. Verify the credentials provided for nokia_nsp_network_management.

```text
login to nokia_nsp_network_management using the provided credentials
```

5. Verify the API of the call utilized for nokia_nsp_network_management Healthcheck.

```text
Go into the Itential Platform GUI and verify/update the properties
```

### Functional Issues

Adapter logs are located in `/var/log/pronghorn`. In older releases of the Itential Platform, there is a `pronghorn.log` file which contains logs for all of the Itential Platform. In newer versions, adapters can be configured to log into their own files.