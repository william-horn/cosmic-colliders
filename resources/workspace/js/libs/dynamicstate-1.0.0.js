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

! NOTE: DynamicState must ALWAYS be imported AFTER PseudoEvent. This is because DynamicState actually loads 
! PseudoEvent before PseudoEvent loads itself. These two modules are co-dependant.

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

-   

==================================================================================================================================
*/

import PseudoEvent from "./pseudo-events-2.1.0.js";

export default class DynamicState {
    constructor(states) {
        this.className = "DynamicState";
        this.states = states;
        this.state = "initial"; // default state

        // events
        this.onStateChanged = new PseudoEvent();
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

        if (oldState != state) {
            this.onStateChanged.fire(this.state);
        }
    }

    isState(state) {
        return this.state === state;
    }
}

