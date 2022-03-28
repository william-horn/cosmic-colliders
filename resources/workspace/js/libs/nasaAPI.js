/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 James Primitive (Christopher J. Hoke), William J. Horn
? @document-name:          main.js
? @document-created:       03/22/2022
? @document-modified:      03/22/2022
? @document-version:       v1.0.0

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

const sources = {
    cad: getAPIData({
        root: 'https://ssd-api.jpl.nasa.gov/cad.api',
        //apiKey: 'mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql',
    }),
}

function getAPIData(options) {
    const api = {
        root: options.root || '',
        defaultParams: options.defParams || '',
        apiKey: options.apiKey || '',
        proxy: 'https://noahs-server-proj1.herokuapp.com/'
    };

    api.getUrl = function(options={}) {
        let customParams = '';
        const params = options.params || {};

        for (let key in params || {}) {
            customParams += `&${key}=${params[key]}`;
        }

        // get rid of '&' for first parameter prefix
        customParams = customParams.substring(1);

        return (options.proxy ? this.proxy : '')
            + this.root + '?'
            + this.defaultParams
            + customParams
            + this.apiKey
    }

    api.formatFields = function(rawData) {
        const datalist = [];
        const fields = rawData.fields;
        const data = rawData.data;

        for (let i = 0; i < data.length; i++) {
            const snapshot = {};

            for (let k = 0; k < fields.length; k++) {
                let val = data[i][k];
                let key = fields[k];
                let keyLookups = {
                    'cd': 'date', 
                    'des': 'name'
                };

                // convert from AU to KM if field is distance
                if (key.match('dist')) val *= 149597870.691;
                // convert key name to something more readable
                key = keyLookups[key] || key;
                snapshot[key] = val;
            }

            datalist[i] = snapshot;
        }

        return datalist;
    }

    return api;
}

export async function getAPIRequest(source, options={}) {
    // build api params
    const api = sources[source];
    const url = api.getUrl(options);

    console.log('constructed url: ', url);

    const response = await fetch(url)
    const responseData = await response.json();

    console.log('raw data: ', responseData);
    console.log('data: ', api.formatFields(responseData));

    return responseData;
}


