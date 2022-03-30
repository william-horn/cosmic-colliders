# **api.js** Documentation
*Author: William J. Horn*

This module was created with the intention of keeping the `main.js` file smaller and cleaner by writing all of the API request logic in `api.js`. This module also provides a nice interface when working with API requests, as it gives you some options to tack-on to a request URL in a quick, easy, and scalable fashion.

## Getting Started

This module just has one use -- making Server-Side API requests. Therefore, the only function that comes packaged with this module is the `getAPIRequest()` function. 

Before using this function, you need to go inside the `api.js` module and predefine some information about the API(s) you wish to work with. This information should be predefined inside the `APIsources` object, and will look something like this:

```javascript
const APISources = {
    'api_name': getAPIData({
        // defaultParams: '&key_1=value_1&...'  | (optional)
        // format: (function)                   | (optional)
        // root: 'https://...'                  | (*required)
        // apiKey: 'api_key: ...'               | (optional/required will vary)        
    })
}
```
* **Note:** You **must** write all of these fields inside of the `getAPIData` function, while passing an object containing the fields you wish to establish.

`'api_name'` 
* An arbitrary name that you can call whatever you want. This is the name that you will access when calling `getAPIRequest('api_name', ...)`

`defaultParams` 
* Can be a string containing query parameters that you are absolutely certain will be used during every request. It should be in this format: [&key1=value1&key2=value2&...]()

`format` 
* A function that should re-format the response data in a way that you define. This is an optional field that isn't recommended to be used unless you know what you're doing.

`root` 
* Represents the root api link.

`apiKey` 
* Represents the api key that you may or may not need. If you need an api key, then this field should look something like this: `'apiKey=...'`
    - **Note:** `apiKey` will be different depending on what the server accepts as their api key name.


## Using getAPIRequest

With api set-up complete, you can now use the `getAPIRequest()` function to reference api data stored within the `APIsources` object. This function takes two parameters, though the last one is optional (but very commonly used).

```javascript
// get api request from 'api_name' data inside of APIsources
getAPIRequest('api_name');

// make the same request as above, but provide an object of options
getAPIRequest('api_name', {...options...})
```

All of the fields inside of the options object are optional so long as the API you are using allows them to be. Here are all of the fields you can include:

##
    {
        useProxy:   true | false, 
        useApiKey:  true | false, 
        formatted:  true | false,
        params:     {
                        'key1': 'value1',
                        'key2': 'value2',
                        ...
                    }
    }

**If no options object is passed to getAPIRequest(), then the function will just make a request to the root link of the API.**

`useProxy`
* A true/false value. If true, the function will include the proxy link before the api call (usually used to bypass CORS errors).

`useApiKey`
* A true/false value. If true, the api will include the api key you have defined inside of the APISources table under that specific api name.

`formatted`
* A true/false value. If true, the api will return whatever the `format` function returns (if one exists). This was intended to allow the developer to re-format the data they received from the api however they choose before they start using it in their main code.

`params`
* An object containing key/value pairs that correspond with the query parameters of the api. This field will be converted from object form:
    - `{'key1': 'value1', 'key2': 'value2', ...}`
    
    to url query parameter form (string):

    - `'&key1=value1&key2=value2&...'`

Here is an example of the `getAPIRequest` function in action, making a request to NASA's CAD API:

```javascript
// INSIDE api.js
const APISources = {
    'cad': getAPIData({
        root: 'https://ssd-api.jpl.nasa.gov/cad.api',
        apiKey: 'api_key=mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql',
    })
}
```

```javascript
// INSIDE main.js
import { getAPIRequest } from './api.js';

const nasaCADRequest = getAPIRequest('cad', {
    useProxy: true,
    params: {
        'sort': 'dist',
        'dist-max': '0.001'
    }
});

// made request to constructed link: 

// https://noahs-server-proj1.herokuapp.com/https://ssd-api.jpl.nasa.gov/cad.api?sort=dist&dist-max=0.001&apiKey=mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql
```

**End of documentation**