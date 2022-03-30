/*
? @document-start
=====================
| LOCAL STORAGE API |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          datastore.js
? @document-created:       03/15/2022
? @document-modified:      03/15/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

- Coming soon

==================================================================================================================================

? @document-api
=============
| ABOUT API |
==================================================================================================================================

const datakeys = datastore.datakeys;
datakeys.name1 = "userdata";

datastore.get(datakeys.name1)
datastore.update(datakeys.name1, oldData => {}) // err, name1 was not given a default in above 'get' request

datastore.get("invalidName", null) // pass second argument as null if you want to throw an error if data name doesn't exist
==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Add function that returns how full the localStorage is --NOT DONE
-   Add cache? --REMINDER

==================================================================================================================================
*/

const datastore = {
    datakeys: {}, // localStorage item keys
    cache: {} // get cache
}

function handleErr(condition, ...args) {
    if (condition) console.error(...args);
    return condition;
}

datastore.get = function(datakey, def) {
    let data = localStorage.getItem(datakey);
    const cachedData = this.cache[datakey];

    if (handleErr(!data && def === null, "No previous data was found")) return;

    if (!data) {
        data = def;
    } else {
        data = JSON.parse(data);
    }

    if (cachedData === undefined) {
        this.cache[datakey] = data;
    }

    return data;
}

datastore.update = function(datakey, callback) {
    let savedData = this.get(datakey);

    if (savedData === undefined) {
        savedData = this.cache[datakey];
        if (handleErr(!savedData, "Attempt to update non-existent data.")) return;
    }

    savedData = callback(savedData);
    if (handleErr(!savedData, "No data was returned in update callback; canceling set request")) return;
    this.save(datakey, savedData);
}

datastore.save = function(datakey, value) {
    localStorage.setItem(datakey, JSON.stringify(value));
}

datastore.remove = function(datakey) {
    localStorage.removeItem(datakey);
}

datastore.clearAll = function(datakey) {
    localStorage.clear();
}

export default datastore