/*
? @document-start
========================
| EVENT HANDLER MODULE |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          event-handler.js
? @document-created:       03/16/2022
? @document-modified:      03/22/2022
? @document-version:       v1.1.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Coming soon

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

!-  Currently re-writing entire library. NOT ready for functional use.

==================================================================================================================================
*/

import PseudoEvent from "./pseudo-events-2.1.0.js";
import DynamicState from "./dynamicstate-1.0.0.js";

// jQuery support for events
const eventConnectorName = window.jQuery ? "on" : "addEventListener";
const eventDisconnectorName = window.jQuery ? "off" : "removeEventListener";

export default class EventHandler {
    constructor() {
        this.className = "EventHandler";

        /* 
            this.childEvents = [
                ListenerObject,
                ListenerObject,
                ListenerObject,
            ]

            this.connections = [

            ]

            this.parentEvent = none;
        */
    }

}
