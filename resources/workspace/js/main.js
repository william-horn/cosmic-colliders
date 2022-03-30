/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 James Primitive (Christopher J. Hoke), William J. Horn
? @document-name:          main.js
? @document-created:       03/22/2022
? @document-modified:      03/28/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

MAIN USE
getAPIRequest('apod', {
    useApiKey: true,
    params: {
        'count': '100',
    }
});

MAIN USE
getAPIRequest('cad', {
    useProxy: true,
    formatted: true,
    params: {
        "dist-max": "0.001",
        "date-min": "2021-01-01",
        "sort": "dist",
        "body": "Earth",
    }
});

const nasaCADRequest = getAPIRequest('cad', {
    useProxy: true,
    params: {
        'sort': 'dist',
        'dist-max': '0.001'
    }
});


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
/* ---------------- */
/* Import Libraries */
/* ---------------- */
import getAPIRequest from './libs/api.js';
import datastore from './libs/datastore-1.0.0.js';

/* ------------------------- */
/* Global Element References */
/* ------------------------- */
// Initialize global element refs as undefined until the document loads
let neoSearchFieldEl;
let neoTableBodyEl;
let imageContainerEl;
let neoSearchDropdownEl;
let neoSearchDropdownContainerEl;
let namebtnEl;
let yearbtnEl;
let distbtnEl;
let img1El;


/* ----------------------- */
/* Internal Program States */
/* ----------------------- */
// create localstorage datakey name(s)
const datakeys = datastore.datakeys;
datakeys.searchHistory = 'cosmic-colliders:search-history';

// configurable search settings
const searchSettings = {
    historyLength: 15, // maximum number of search results that will be saved
    searchHistory: datastore.get(datakeys.searchHistory, []),

    // responsive messages
    errorMessage: 'Invalid entry',
}

/* ---------------------- */
/* General Util Functions */
/* ---------------------- */

/* ------------------------ */
/* Dedicated Util Functions */
/* ------------------------ */
// Assign global element refs
function loadUIReferences() {
    neoSearchFieldEl = $('#neo-search-field');
    neoTableBodyEl = $('#neo-table-body');
    imageContainerEl = $('#image-container');
    neoSearchDropdownEl = $('#neo-search-dropdown');
    neoSearchDropdownContainerEl = $('#neo-search-history-container');
    namebtnEl = $('#name-btn');
    yearbtnEl = $('#year-btn');
    distbtnEl = $('#dist-btn');
}

// generate data row from CAD API data
function createNEOTableRowString(neoData) {
    return `
        <tr>
            <td><a href="/">${neoData.name}</a></td>
            <td>${neoData.dist.toLocaleString("en-US") + 'KM'}</td>
            <td>${neoData.date}</td>
        </tr>
    `;
}

// generate NEO search results from CAD API
function generateNEORows(neoDataCollection) {
    $(neoTableBodyEl).empty();
    let rowString = '';

    console.log(neoDataCollection)
    for (let i = 0; i < neoDataCollection.length; i++) {
        rowString += createNEOTableRowString(neoDataCollection[i]);
    }

    $(neoTableBodyEl).html(rowString);
}

// handle logic for user search
function processSearchQuery(searchOptions) {
    
    const NEODataPromise = getAPIRequest('cad', {
        useProxy: true,
        formatted: true,
        params: {
            'dist-max': '0.001',
            'date-min': searchOptions.searchFilter === 'date' ? searchOptions.query + '-01-01' : '2021-08-19',
            'sort': searchOptions.searchFilter,
            'body': 'Earth',
        }
    });

    NEODataPromise.then(dataCollection => generateNEORows(dataCollection));
    const imagePromise = getAPIRequest('apod', {useApiKey:true , params : {count:1}})
    imagePromise.then(imageCollect => {
        let tableData2=""
        imageCollect.map((singleImage)=>{
            tableData2+=`<tr>
            <td><a href="${singleImage.url}"><img src="${singleImage.url}"/></a></td>
            </tr>`
            
        })
            $("#table_body2").html(tableData2);
    })
}

//Button 1.click (connect to onSearchButtonPressed function) * Do for button 2 and 3 as well.
function onSearchButtonPressed(searchFilter){
    processSearchQuery({
        query: $(neoSearchFieldEl).val(),
        saveHistory: true,
        searchFilter: searchFilter,
    })
    console.log(searchFilter)
}

// save recent search result to local storage
function addSearchQueryToHistory(searchData) {
    datastore.update(datakeys.searchHistory, data => {
        // if new search data is the same as the most recent, don't update
        if (data.length > 0 && data[0].id === searchData.id) return data;

        // update search history
        data.unshift(searchData);
        if (data.length > searchSettings.historyLength) data.pop();
        return data;
    });
}

// function responsible for loading the NEO search history under the NEO search dropdown
function loadNeoSearchHistory() {
    $(neoSearchDropdownContainerEl).empty() // clear old search result buttons

    // retrieve search history
    const resultData = datastore.get(datakeys.searchHistory, [
        {id: 'No previous search history yet', info: true}
    ]);

    // traverse search history and generate search result buttons
    for (let i = 0; i < resultData.length; i++) {
        const result = resultData[i];

        let labelEl = result.info
            ? $(`<p class='has-text-left'>${result.id}</p>`) 
            : $(`<button class='button'>${result.id}</button>`);

        $(neoSearchDropdownContainerEl).append(labelEl);
    }
}

/* ------------------------ */
/* Event Callback Functions */
/* ------------------------ */

// callback for when a user presses enter on the search bar
function onSearchBarEnter(event) {
    if (event.keyCode != 13) return; // if the user presses enter, continue

    // unfocus the search field
    $(neoSearchFieldEl).blur();

    // call the search query function to begin processing search request
    processSearchQuery({
        query: $(neoSearchFieldEl).val(),
        saveHistory: true,
        searchFilter: "name/date/dist" //<---PLACEHOLDER VALUES FOR 3 TYPES OF STRINGS TO BE PASSED
    });
}

// when the user clicks on the search bar
function onSearchFocus(event) {
    $(neoSearchDropdownEl).show();
    $(neoSearchFieldEl).val('');
    loadNeoSearchHistory();
}

// when then user is off the search bar
function onSearchFocusLost(event) {
    $(neoSearchDropdownEl).hide();
}


// Prime-mover function for establishing initial program states before anything else runs
function init() {

    // load all UI references
    loadUIReferences();

    // Link callbacks to event listeners

    $(neoSearchFieldEl).focusout(onSearchFocusLost);
    $(neoSearchFieldEl).focus(onSearchFocus);
    $(neoSearchFieldEl).keyup(onSearchBarEnter);
    $(namebtnEl).click( () => onSearchButtonPressed('name') )
    $(yearbtnEl).click( () => onSearchButtonPressed('date') )
    $(distbtnEl).click( () => onSearchButtonPressed('dist') )
}

/* -------------------------- */
/* Connect Js Event Listeners */
/* -------------------------- */
// Run program 'init' function when the document is ready
$(document).ready(init);

