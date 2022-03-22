/*
? @document-start
=========================
| GENERIC API UTILITIES |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          gutil.js
? @document-created:       03/04/2022
? @document-modified:      03/11/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

This is a weird limbo state where my code that doesn't fit under any library category currently lives
until I can find it a purpose. Behold, the "general utility" library.

==================================================================================================================================

? @document-api
=============
| ABOUT API |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

?-   Possibly make separate dedicated libraries for:
-       * Math (randomInt, randomizeArray, ...)
-       * Time (getClockHour, ...)
-       * JS Routines (forInterval, ...)
-       * Native Objects (shallowCopyArray, ...)

==================================================================================================================================
*/

const gutil = {};

// wrap for-loop logic in a 'setInterval' to achieve delay between loop cycles
function forInterval(start, stop, step, delay, callback) {
    let count = start;
    const routine = setInterval(() => {
        callback(count);
        count += step;
        if (count > stop) clearInterval(routine);
    }, delay);
}

// generate math sequence {12, 1, 2, ..., 12, 1, 2, ...} based on given index
function getClockHour(index) {
    const time = (index + 11)%12 + 1;
    const postfix = ~~(index/12)%2 == 0 ? "am" : "pm";
    return { value: time, timePostfix: postfix }
}

// uniformly generate a random int between [min, max]
function randomInt(min, max) {
    if (!max) { max = min; min = 0; }
    [min, max] = [Math.floor(min), Math.floor(max)];
    return min + Math.floor((max - min + 1)*Math.random());
}

// randomize existing array indices
function randomizeArray(array) {
    for (let i = 0; i < array.length; i++) {
        const randIndex = randomInt(i, array.length - 1);
        [array[i], array[randIndex]] = [array[randIndex], array[i]];
    }
    return array;
}

// clone ordinary data in array (no metadata)
function shallowCopyArray(array) {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray[i] = array[i];
    }
    return newArray;
}

// get random index from array
function getRandomIndex(array) {
    return array[randomInt(array.length - 1)];
}

// api
// treeSearch( {{{ ... }}}, depth=5, () => {} )
// treeSearch( {{{ ... }}}, () => {} )
// recursive tree search 
// @note probably super slow, remember to benchmark later
function treeSearch(object, maxDepth, callback) {
    callback = callback || maxDepth;
    maxDepth = typeof maxDepth === "function" ? null : maxDepth;

    let depth = 0;
    const results = [];

    function open(deepObject) {
        depth++;
        for (let key in deepObject) {
            const val = deepObject[key];
            switch(typeof val) {
                case "object":
                    if (maxDepth ? depth <= maxDepth : true) {
                        open(val);
                        break;
                    }

                default:
                    const result = callback(val);
                    if (!result === undefined) results.push(val);
            }
        }
        depth--;
    }

    open(object);
    return results
}

// module utility
gutil.getRandomIndex = getRandomIndex;
gutil.randomInt = randomInt;
gutil.randomizeArray = randomizeArray;
gutil.shallowCopyArray = shallowCopyArray;
gutil.forInterval = forInterval;
gutil.getClockHour = getClockHour;
gutil.treeSearch = treeSearch;

export default gutil;