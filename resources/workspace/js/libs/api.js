/*
? @document-start
======================
| API REQUEST MODULE |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          api.js
? @document-created:       03/28/2022
? @document-modified:      03/28/2022

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

CORS Proxy:
    Root: https://noahs-server-proj1.herokuapp.com/ 

NASA CAD API:

    Documentation: https://ssd-api.jpl.nasa.gov/doc/cad.html
    API Root: https://ssd-api.jpl.nasa.gov/cad.api
    API key: mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql

NASA APOD API:

    Full documentation (github): https://github.com/nasa/apod-api
    NASA API documentation found here: https://api.nasa.gov/#apod
    API Root: https://api.nasa.gov/planetary/apod


Unrelated:

    Cool space image background: https://apod.nasa.gov/apod/image/0504/hercules_misti_big.jpg

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

==================================================================================================================================
*/

const APISources = {
    'cad': getAPIData({
        // defaultParams: '&key=value'
        format: formatCADFields,
        root: 'https://ssd-api.jpl.nasa.gov/cad.api',
        apiKey: 'api_key=mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql',
    }),

    'apod': getAPIData({
        // defaultParams: '&key=value'
        // format: (function)
        root: 'https://api.nasa.gov/planetary/apod',
        apiKey: 'api_key=mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql',
    }),
}

// return formatted data structure for CAD API fields (ex. [{name: '2020 VJ4', ...}, ...])
function formatCADFields(rawData) {
    const datalist = [];
    const fields = rawData.fields;
    const data = rawData.data;

    if (!data) return [];

    // iterate over the entire data object returned by the request
    for (let i = 0; i < data.length; i++) {
        const snapshot = {};

        // iterate over the 'fields' array inside the main data object and
        // map each field value to the corresponding data value inside the CAD data arrays
        for (let k = 0; k < fields.length; k++) {
            let val = data[i][k];
            let key = fields[k];

            // some field key aliases that make more sense
            let keyAliases = {
                'cd': 'date', 
                'des': 'name'
            };

            // convert from AU to KM if field is distance
            if (key.match('dist')) val = fromAUtoKM(val);
            // convert key name to something more readable
            key = keyAliases[key] || key;
            snapshot[key] = val;
        }

        datalist[i] = snapshot;
    }

    return datalist;
}

// convert astronomical units to KM (kilometers)
function fromAUtoKM(au) {
    return ~~(au*149597870.691);
}

// create generic reusable api data
function getAPIData(apiOptions) {
    const api = {
        root: apiOptions.root || '',
        defaultParams: apiOptions.defParams || '',
        apiKey: apiOptions.apiKey || '',
        format: apiOptions.format,
        proxy: 'https://noahs-server-proj1.herokuapp.com/'
    };

    api.getUrl = function(urlOptions={}) {
        let builtUrl = this.defaultParams;
        const params = urlOptions.params || {};

        for (let key in params || {}) {
            builtUrl += `&${key}=${params[key]}`;
        }

        // get rid of '&' for first parameter prefix
        if (urlOptions.useApiKey) builtUrl += '&' + this.apiKey;
        builtUrl = builtUrl.replace('&', '?');

        return (urlOptions.useProxy ? this.proxy : '')
            + this.root
            + builtUrl
    }

    return api;
}

// utility function that fetches a request by constructing the fetch URL based on some given parameters
/*
    @param-1: The name of the API as is stored in the 'sources' table.
    @param-2: API request options

    getAPIRequest('api_name', {
    useProxy: true/false,    => whether the request summons the dark lords or not
    useApiKey: true/false,   => whether the request includes the api key or not
    params: {                => additional parameters (turns into '&key=value' in the code)
        'key': 'value',
        ...
    }
    })
*/
export default async function getAPIRequest(source, options={}) {
    // build api params
    const api = APISources[source];
    const url = api.getUrl(options);

    console.log('constructed url: ', url); // keep for debugging

    const response = await fetch(url)
    const responseData = await response.json();

    // console.log('raw data: ', responseData); // keep for debugging
    if (responseData.code) {
        console.log('request error: ', responseData.moreInfo);
        console.log('issue: ', responseData.message);
        return;
    }

    if (options.formatted && api.format) {
        const formattedData = api.format(responseData);
        // console.log('formatted data: ', formattedData);
        return formattedData;
    }

    return responseData;
}

