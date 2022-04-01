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
import gutil from './libs/gutil-1.0.0.js';

/* ------------------------- */
/* Global Element References */
/* ------------------------- */
// Initialize global element refs as undefined until the document loads
let neoSearchFieldEl;
let neoTableBodyEl;
let imageContainerEl;
let neoSearchDropdownEl;
let neoSearchDropdownContainerEl;
let neoSearchFieldParentEl;
let namebtnEl;
let yearbtnEl;
let distbtnEl;
let apodImg;
let newApodBtn;
let apodDescEl;

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
    neoSearchFieldParentEl = $('#neo-search-field-parent');
    neoSearchDropdownContainerEl = $('#neo-search-history-container');
    namebtnEl = $('#name-btn');
    yearbtnEl = $('#year-btn');
    distbtnEl = $('#dist-btn');
    apodImg = $('#apod-img');
    newApodBtn = $('#new-apod-btn');
    apodDescEl = $('#apod-container i');
}

// generate data row from CAD API data
function createNEOTableRowString(neoData) {
    return `
        <tr>
            <td><a href="/">${neoData.name}</a></td>
            <td>${neoData.dist.toLocaleString("en-US") + 'KM'}</td>
            <td>${neoData.date.substring(0, 12)}</td>
        </tr>
    `;
}

// generate NEO search results from CAD API
function generateNEORows(neoDataCollection) {
    if (!neoDataCollection) return cancelSearchLoadingAnim();

    $(neoTableBodyEl).empty();
    let rowString = '';

    console.log(neoDataCollection)
    for (let i = 0; i < neoDataCollection.length; i++) {
        rowString += createNEOTableRowString(neoDataCollection[i]);
    }

    cancelSearchLoadingAnim();
    $(neoTableBodyEl).html(rowString);
}

function generateAPODImage() {
    $(newApodBtn).addClass('is-loading');
    const imagePromise = getAPIRequest('apod', {useApiKey:true , params : {count:1}});

    imagePromise.then(imageCollect => {
        $(apodImg).attr('src', imageCollect[0].url);
        $(apodDescEl).text(imageCollect[0].explanation || 'No description available');
        $(newApodBtn).removeClass('is-loading');
    })
}

function startSearchLoadingAnim() {
    $(neoSearchFieldEl).attr('disabled', true);
    $(neoSearchFieldParentEl).addClass('is-loading');
}

function cancelSearchLoadingAnim() {
    $(neoSearchFieldEl).attr('disabled', false);
    $(neoSearchFieldParentEl).removeClass('is-loading');
}

function generalSearchAlgorithm() {

}

function fromKMtoAU(km) {
    return km/149597870.691;
}

// handle logic for user search
function processSearchQuery(searchOptions) {

    // searchOptions {
        // query: [string] (user search-bar entry)
        // saveHistory: [boolean] true/false (add search to history)
        // searchFilter: [string] 'name'/'dist'/'date' (how to sort search results)
    // }
    
    // todo: add search algorithm (include search filters) --NOT DONE
    // todo: finish styling page --DONE
    // todo: touch up search dropdown bar --DONE

    // get reference to search query text
    const searchQuery = searchOptions.query.trim();
    const filter = searchOptions.searchFilter || 'all';

    // exit if search query is empty string
    if (searchQuery === '') return;

    // start responsive loading animations
    startSearchLoadingAnim();

    // make API call to CAD
    const cadRequestOptions = {
        useProxy: true,
        formatted: true,
        params: {
            'dist-max': '0.001',
            'date-min': '2013-08-19',
            'body': 'Earth',
        }
    }

    // make CAD request for relevant search data
    const NEODataPromise = getAPIRequest('cad', cadRequestOptions);
    NEODataPromise.then(neoData => {
        
        generateNEORows(sortedData.length === 0 ? neoData : sortedData);
    });

    // save search query to local storage history if it has permission
    if (searchOptions.saveHistory) {
        addSearchQueryToHistory({
            id: searchOptions.query
        });
    }
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
function loadNEOSearchHistory() {
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

function onSearchOptionPressed(event) {
    const target = event.target;
    console.log(target);

    if ($(target).hasClass('button')) {
        $(neoSearchFieldEl).val($(target).text());
    }
}

// callback for when a user presses enter on the search bar
function onSearchBarEnter(event) {
    if (event.keyCode != 13) return; // if the user presses enter, continue
    const searchQuery = $(neoSearchFieldEl).val();

    // unfocus the search field
    $(neoSearchFieldEl).blur();

    // call the search query function to begin processing search request
    onSearchButtonPressed('all');
}

// when the user clicks on the search bar
function onSearchFocus(event) {
    $(neoSearchDropdownEl).show();
    loadNEOSearchHistory();
}

// when then user is off the search bar
function onSearchFocusLost(event) {
    $(neoSearchDropdownEl).hide();
}


// Prime-mover function for establishing initial program states before anything else runs
function init() {

    // load all UI references
    loadUIReferences();

    // load first apid image
    generateAPODImage();

    // Link callbacks to event listeners
    $(neoSearchFieldEl).focusout(onSearchFocusLost);
    $(neoSearchFieldEl).focus(onSearchFocus);
    $(neoSearchFieldEl).keyup(onSearchBarEnter);
    $(neoSearchDropdownContainerEl).on("mousedown", onSearchOptionPressed);
    $(newApodBtn).click(generateAPODImage);
    $(namebtnEl).click( () => onSearchButtonPressed('name') )
    $(yearbtnEl).click( () => onSearchButtonPressed('date') )
    $(distbtnEl).click( () => onSearchButtonPressed('dist') )
}

/* -------------------------- */
/* Connect Js Event Listeners */
/* -------------------------- */
// Run program 'init' function when the document is ready
$(document).ready(init);

