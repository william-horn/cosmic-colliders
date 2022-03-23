/*
? @document-start
=====================
| DYNAMIC STATE API |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          dynamicstate.js
? @document-created:       03/15/2022
? @document-modified:      03/15/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================



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

-   Find a way to re-implement 'onStateChanged' without causing stack loop with pseudo-events --NOT DONE

==================================================================================================================================
*/


export default class DynamicState {
    constructor(states) {
        this.className = "DynamicState";
        this.states = states;
        this.state = "initial"; // default state
    }

    getState() {
        return this.state;
    }

    setState(state) {
        if (!this.states[state]) {
            console.error("DynamicState Class: '" + state + "' is not a valid state");
            return;
        }

        const oldState = this.state;
        this.state = this.states[state];
    }

    isState(state) {
        return this.state === state;
    }
}

