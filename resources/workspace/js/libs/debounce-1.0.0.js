/*
? @document-start
==================
| DEBOUNCE CLASS |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          debounce.js
? @document-created:       03/11/2022
? @document-modified:      03/11/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

A small debouncer library that enables API handling of toggleable functions.

==================================================================================================================================

? @document-api
=============
| ABOUT API |
==================================================================================================================================

f = function

---

const debounceFunction = debouncer.debounce(f) // debounce state is open by default
debounceFunction() // debounce state is open, function WILL execute (updated state: closed)
debounceFunction() // debounce state is closed; function WILL NOT execute (updated state: closed)

const debounceFunctionData = debouncer.getDebounceData(f) // get the debounce data for the function
debounceFunctionData.open() // manually open the debounce state (externally)

debounceFunction() // debounce state is open, function WILL execute (updated state: closed)
debounceFunction() // debounce state is closed; function WILL NOT execute (updated state: closed)

debounceFunctionData.open() // manually open the debounce state (externally)
debounceFunctionData.close() // manually close the debounce state (externally)

debounceFunction() // debounce state is closed; function WILL NOT execute (updated state: closed)

---

const debounceFunction = debouncer.debounce(f, 2000) // debounce state will re-open after 2000ms of it being closed
debounceFunction() // debounce state is open, function WILL execute (updated state: closed)
debounceFunction() // debounce state is closed; function WILL NOT execute (updated state: closed)

setTimeout(() => {
    debounceFunction() // debounce state is open, function WILL execute (updated state: closed)
}, 2001) 



function test() {
    console.log("function code running")
    
    this.open(); // this OR 
    debouncer.getDebounceData(test).open(); // this OR 
    debounceData.open(); // this
}

const debouncedFunction = debouncer.debounce(test);
const debounceData = debouncer.getDebounceData(test);
debouncedFunction(); // initial run

debounceData.setStateTimeout("open", 5000);
setInterval(() => debouncedFunction(), 1000);
setTimeout(() => debounceData.open(), 8000);

---

const debounceFunction = debouncer.debounce(f)
const debounceFunctionData = debouncer.getDebounceData(f)

debounceFunctionData.isOpen() // returns: true; IF debounce state is set to "open"
debounceFunctionData.isClosed() // returns: false; IF debounce state is set to "closed"

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Make DebounceData an extension of the DynamicStates class --DONE

==================================================================================================================================
*/

import PseudoEvent from "./pseudo-events-2.1.0.js";
import DynamicState from "./dynamicstate-1.0.0.js";

// debounce library
const debouncer = {};

// map of all debounced functions
const debounced = new Map(); // {key: func}, {value: {...}}

// debounce state refs
const debStates = {
    "open": "open",
    "closed": "closed"
}

const invertedDebStates = {
    "open": "closed",
    "closed": "open"
}

// class for debounce data
class DebounceData extends DynamicState {
    constructor(f) {
        super(debStates);
        this.setState("open");

        this.className = "DebounceData";
        this.source = f;
        this.stateTimeoutRoutine = undefined;
    }

    clearStateTimeoutRoutine() {
        clearTimeout(this.stateTimeoutRoutine);
        this.stateTimeoutRoutine = undefined;
    }

    getInvertedState(state) {
        return invertedDebStates[state];
    }

    setDebounceState(state, override=false) {
        // (!debStates[state]) ==> return if state is invalid type
        // OR
        // (this.stateTimeoutRoutine && !override) ==> return if a stateTimeoutRoutine exists with no override
        if ((this.stateTimeoutRoutine && !override) || !this.states[state]) return;
        this.clearStateTimeoutRoutine();
        this.setState(state);
    }

    invertState(state, override=false) {
        this.setDebounceState(this.getInvertedState(state), override);
    }

    close(override=false) {
        this.setDebounceState("closed", override);
    }

    open(override=false) {
        this.setDebounceState("open", override);
    }

    callSource(...args) {
        this.source(...args);
    }

    isClosed() {
        return this.isState("closed");
    }

    isOpen() {
        return this.isState("open");
    }

    setStateTimeout(state, time) {
        this.setDebounceState(state, true);
        this.stateTimeoutRoutine = setTimeout(() => {
            this.setDebounceState(this.getInvertedState(state), true);
        }, time);
    }
}

function getDebounceData(f) {
    return debounced.get(f);
}

function debounce(f, delay) {
    let debRef = getDebounceData(f);

    if (debRef && debRef.isClosed()) {
        return () => {}; // function is currently debounced, return empty function to avoid error
    } else if (!debRef) {
        debRef = new DebounceData(f);
        debounced.set(f, debRef);
    }

    return (...args) => {
        if (debRef.isOpen()) {
            debRef.close();
            debRef.callSource(...args);
            if (delay) debRef.setStateTimeout("closed", delay);
        }
    }
}

debouncer.getDebounceData = getDebounceData;
debouncer.debounce = debounce;

export default debouncer;