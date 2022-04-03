/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 James Primitive (Christopher J. Hoke), William J. Horn
? @document-name:          main.js
? @document-created:       03/22/2022
? @document-modified:      03/28/2022

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
let searchFilterBtnContainerEl;
let namebtnEl;
let yearbtnEl;
let distbtnEl;
let apodImg;
let newApodBtn;
let apodDescEl;

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */
let searchFilterBtns; // array container for the 3 search filter buttons

// create localstorage datakey name(s)
const datakeys = datastore.datakeys;
datakeys.searchHistory = 'cosmic-colliders:search-history';

// configurable search settings
const searchSettings = {
    historyLength: 15, // maximum number of search results that will be saved
    searchHistory: datastore.get(datakeys.searchHistory, []),
    currentFilter: {},

    // responsive messages
    errorMessage: 'Invalid entry',
}

/* ---------------------- */
/* General Util Functions */
/* ---------------------- */
// uniformly generate a random int between [min, max]
function randomInt(min, max) {
    if (!max) { max = min; min = 0; }
    [min, max] = [Math.floor(min), Math.floor(max)];
    return min + Math.floor((max - min + 1)*Math.random());
}

function fromKMtoAU(km) {
    return km/149597870.691;
}

/* ------------------------ */
/* Dedicated Util Functions */
/* ------------------------ */
// update current search filter with new filter
function updateSearchFilter(newFilter) {
    searchSettings.currentFilter.button = newFilter.button;
    searchSettings.currentFilter.filterType = newFilter.filterType;

    for (let i = 0; i < searchFilterBtns.length; i++) {
        const filterData = searchFilterBtns[i];
        if (filterData.button[0] === newFilter.button[0]) {
            filterData.button.removeClass('is-info');
            filterData.button.addClass('filter-btn-pressed');
        } else {
            filterData.button.removeClass('filter-btn-pressed');
            filterData.button.addClass('is-info');
        }
    }
}

// Assign global element refs
function loadUIReferences() {
    neoSearchFieldEl = $('#neo-search-field');
    neoTableBodyEl = $('#neo-table-body');
    imageContainerEl = $('#image-container');
    neoSearchDropdownEl = $('#neo-search-dropdown');
    neoSearchFieldParentEl = $('#neo-search-field-parent');
    neoSearchDropdownContainerEl = $('#neo-search-history-container');
    searchFilterBtnContainerEl = $('#search-filter-btns');
    namebtnEl = $('#name-btn');
    yearbtnEl = $('#year-btn');
    distbtnEl = $('#dist-btn');
    apodImg = $('#apod-img');
    newApodBtn = $('#new-apod-btn');
    apodDescEl = $('#apod-container i');

    // search filter buttons and metadata
    searchFilterBtns = [
        {button: namebtnEl, filterType: 'name'},
        {button: yearbtnEl, filterType: 'date'},
        {button: distbtnEl, filterType: 'dist'}
    ];

    console.log(searchFilterBtns);

    updateSearchFilter(searchFilterBtns[0]);
}

// generate data row from CAD API data
function createNEOTableRowString(neoData) {
    return `<tr>
        <td><a href="/">${neoData.name}</a></td>
        <td>${neoData.dist ? neoData.dist.toLocaleString("en-US") + 'KM': ''}</td>
        <td>${neoData.date ? neoData.date.substring(0, 12) : ''}</td></tr>`;
}

// generate NEO search results from CAD API
function generateNEORows(neoDataCollection) {
    console.log('neo formatted data collection: ', neoDataCollection);
    if (!neoDataCollection) return cancelSearchLoadingAnim();

    $(neoTableBodyEl).empty();
    let rowString = '';

    if (neoDataCollection.length === 0) {
        rowString += createNEOTableRowString({
            name: 'No results found',
        });
    }

    for (let i = 0; i < neoDataCollection.length; i++) {
        rowString += createNEOTableRowString(neoDataCollection[i]);
    }

    cancelSearchLoadingAnim();
    $(neoTableBodyEl).html(rowString);
}

// @James Primitive
// todo: preload these images in the future (maybe 100 at a time?)
// todo: keep the 'is-loading' class added to the image element until the image is fully rendered
// - Will
function generateAPODImage() {
    if ($(newApodBtn).hasClass('is-loading')) return; // if the old image is still loading, don't request a new one

    $(newApodBtn).addClass('is-loading');
    const imagePromise = getAPIRequest('apod', {useApiKey:true , params : {count:1}});

    imagePromise.then(imageCollect => {
        $(apodImg).attr('src', imageCollect[0].url);
        $(apodDescEl).text(imageCollect[0].explanation || 'No description available');

        // temporary solution for simulating a longer loading time to account for image render time
        setTimeout(() => {
            $(newApodBtn).removeClass('is-loading');
        }, randomInt(500, 1000));
    })
}

function startSearchLoadingAnim() {
    $(neoSearchFieldEl).attr('disabled', true);
    //$(neoSearchFieldParentEl).addClass('is-loading');
    $(neoSearchFieldEl).addClass('is-loading');
}

function cancelSearchLoadingAnim() {
    $(neoSearchFieldEl).attr('disabled', false);
    //$(neoSearchFieldParentEl).removeClass('is-loading');
    $(neoSearchFieldEl).removeClass('is-loading');
}

function getSearchAlgorithmResults(searchQuery, resultData) {
    const filteredResults = [];
    const filter = searchSettings.currentFilter.filterType;

    console.log('results: ', resultData);
    console.log('filter: ', filter);
    if (!(filter === 'name')) return resultData;

    for (let i = 0; i < resultData.length; i++) {
        const chunk = resultData[i];
        if (chunk.name.toLowerCase().match(searchQuery.toLowerCase())) {
            filteredResults.push(chunk);
        }
    }

    return filteredResults;
}

function sendInvalidSearchError(message) {
    if ($(neoSearchFieldEl).hasClass('error-message')) return;
    const oldText = $(neoSearchFieldEl).val();

    $(neoSearchFieldEl).addClass('error-message');
    $(neoSearchFieldEl).val(message);

    setTimeout(() => {
        $(neoSearchFieldEl).removeClass('error-message');
        $(neoSearchFieldEl).val(oldText);
        cancelSearchLoadingAnim();
    }, 2000);
}

// handle logic for user search
function processSearchQuery(searchOptions) {

    // searchOptions {
        // query: [string] (user search-bar entry)
        // saveHistory: [boolean] true/false (add search to history)
        // searchFilter: [string] 'name'/'dist'/'date' (how to sort search results)
    // }
    
    // todo: add search algorithm (include search filters) --NOT DONE

    // get reference to search query text
    const searchQuery = searchOptions.query.trim();
    const filter = searchSettings.currentFilter.filterType;
    console.log('filter chosen: ', filter);

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
            'date-min': '1990-08-19',
            'body': 'Earth',
        }
    }

    // todo: optimize search engine

    if (filter === 'dist') {
        const updateFilter = parseInt(searchQuery.replaceAll(',', ''));
        if (!updateFilter) {
            sendInvalidSearchError('Distance must be a valid number');
            return;
        }
        cadRequestOptions.params['dist-max'] = fromKMtoAU(updateFilter).toString();
        cadRequestOptions.params.sort = 'dist';
    } else if (filter === 'date') {
        const updateFilter = parseInt(searchQuery);
        if (!updateFilter) {
            sendInvalidSearchError('Year must be a 4-digit number');
            return;
        } else if (updateFilter > 9999 || updateFilter < 1000) {
            sendInvalidSearchError('Year must be between 1990 and now');
            return;
        }
        cadRequestOptions.params['date-min'] = `${updateFilter.toString()}-01-01`;
        cadRequestOptions.params.sort = 'date';
    }

    // make CAD request for relevant search data
    const NEODataPromise = getAPIRequest('cad', cadRequestOptions);
    NEODataPromise.then(neoData => {
        generateNEORows(getSearchAlgorithmResults(searchQuery, neoData.splice(neoData.length - 100, neoData.length)));
        cancelSearchLoadingAnim();
    });

    // save search query to local storage history if it has permission
    if (searchOptions.saveHistory) {
        addSearchQueryToHistory({
            id: searchOptions.query
        });
    }
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

// when user clicks on search result from search bar
function onSearchOptionPressed(event) {
    const target = event.target;
    console.log(target);

    if ($(target).hasClass('button')) {
        $(neoSearchFieldEl).val($(target).text());
    }
}

function onSearchFilterButtonPressed(event) {
    const target = $(event.target);
    const buttonData = searchFilterBtns.find(btnData => btnData.button[0] === target[0]);

    if (buttonData) {
        const oldFilter = searchSettings.currentFilter.filterType;
        updateSearchFilter(buttonData);

        if (buttonData.filterType === oldFilter) {
            processSearchQuery({
                query: $(neoSearchFieldEl).val(),
                saveHistory: true,
            })
        }
    }
}

// callback for when a user presses enter on the search bar
function onSearchBarEnter(event) {
    if (event.keyCode != 13) return; // if the user presses enter, continue
    const searchQuery = $(neoSearchFieldEl).val();

    // unfocus the search field
    $(neoSearchFieldEl).blur();

    // call the search query function to begin processing search request
    processSearchQuery({
        query: $(neoSearchFieldEl).val(),
        saveHistory: true,
    })
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

    $(searchFilterBtnContainerEl).click(onSearchFilterButtonPressed);
}

/* -------------------------- */
/* Connect Js Event Listeners */
/* -------------------------- */
// Run program 'init' function when the document is ready
$(document).ready(init);

