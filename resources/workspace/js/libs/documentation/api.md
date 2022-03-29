# **api.js** Documentation

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
        // apiKey: 'api_key: ...'               | (optiona/required will vary)        
    })
}
```
* **Note:** You **must** write all of these fields inside of the `getAPIData` function, while passing an object containing the fields you wish to establish.

`'api_name'` 
* An arbitrary name that you can call whatever you want. This is the name that you will access when calling `getAPIRequest('api_name', ...)`

`defaultParams` 
* Can be a string containing query parameters that you are absolutely certain will be used during every request. It should be in this format: `'&key1=value1&key2=value2&...'`

`format` 
* A function that should re-format the response data in a way that you define. This is an optional field that isn't recommended to be used unless you know what you're doing.

`root` 
* Represents the root api link,

`apiKey` 
* Represents the api key that you may or may not need. If you need an api key, then this field should look something like this: `'apiKey=...'`
    - **Note:** `apiKey` will be different depending on what the server accepts as their api key name.


# Using getAPIRequest