## Authenticating Nokia NSP Network Infrastructure Management Adapter 

This document will go through the steps for authenticating the Nokia NSP Network Infrastructure Management adapter with OAuth Authentication. Properly configuring the properties for an adapter in IAP is critical for getting the adapter online. You can read more about adapter authentication <a href="https://docs.itential.com/opensource/docs/authentication" target="_blank">HERE</a>. 

### OAuth Two Step Token Authentication
The Nokia NSP Network Infrastructure Management adapter requires OAuth Two Step Token Authentication. If you change authentication methods, you should change this section accordingly and merge it back into the adapter repository.

Nokia NSP Network Infrastructure Management requires Basic Authentication on the token request along with a grant type of "client_credentials".

STEPS  
1. Ensure you have access to a Nokia NSP Network Infrastructure Management server and that it is running
2. Follow the steps in the README.md to import the adapter into IAP if you have not already done so
3. Use the properties below for the ```properties.authentication``` field
```json
"authentication": {
      "auth_method": "request_token",
      "username": "<username>",
      "password": "<password>",
      "token_timeout": 1800000,
      "token_cache": "local",
      "invalid_token_error": 401,
      "auth_field": "header.headers.Authorization",
      "auth_field_format": "Bearer {token}",
      "grant_type": "client_credentials"
}
```
4. Restart the adapter. If your properties were set correctly, the adapter should go online. 

### Troubleshooting
- Make sure you copied over the correct username and password.
- Turn on debug level logs for the adapter in IAP Admin Essentials.
- Turn on auth_logging for the adapter in IAP Admin Essentials (adapter properties).
- Investigate the logs - in particular:
  - The FULL REQUEST log to make sure the proper headers are being sent with the request.
  - The FULL BODY log to make sure the payload is accurate.
  - The CALL RETURN log to see what the other system is telling us.
- Credentials should be ** masked ** by the adapter so make sure you verify the username and password - including that there are erroneous spaces at the front or end.
- Remember when you are done to turn auth_logging off as you do not want to log credentials.
