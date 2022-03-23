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

const eventHandlerStates = {
    "listening": "listening",
    "paused": "paused"
}

class Listener extends DynamicState {
    constructor(data) {
        super(eventHandlerStates);
        this.className = "Listener";
        this.setState("listening");

        this.name = data.name; // arbitrary, optional event name alias
        this.type = data.type; // name of the event type
        this.objRef = data.objRef; // actual reference to the object
        this.callback = data.callback; // callback function given by the developer
        this.handler = data.handler // handler function that wraps the callback function

        this.parentEvent = data ? data.parent : undefined;
        this.childEvents = [];
        this.connections = [];
    }  
}

export default class EventHandler extends Listener {
    constructor() {
        super({});
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

    getListenersWithFilter(eventType, eventName, guiObject) {
        [eventType, eventName, guiObject] = [
            eventType,
            typeof eventName === "object" ? null : eventName,
            typeof eventName === "string" ? guiObject : eventName
        ];

        if (typeof eventType === "object") return [eventType]; // if first and only argument is the Listener OBJECT
        if (!eventName && !guiObject) return [this.listeners[eventType]]; // if first and only argument is the listener TYPE

        return;
    }

    // EventHandler.remove/pause/resume("click")
    // EventHandler.remove/pause/resume("click", "name")
    // EventHandler.remove/pause/resume("click", "name", object)
    // EventHandler.remove/pause/resume("click", object)
    // EventHandler.remove/pause/resume(ListenerObject)
    remove(eventType, eventName, guiObject) {
        const listeners = this.getListenersWithFilter(eventType, eventName, guiObject);
        console.log(listeners);
    }

    // @params: 
    // add(eventName, object, func)
    // add(eventName, customName, object, func)
    add(eventType, customName, object, func) {
        [customName, object, func] = [
            !func ? false : customName, 
            !func ? customName : object,
            !func ? object : func
        ];

        console.log(eventType, customName, object, func)


    }

    pause(...args) {
        this.config("pause", ...args);
    }

}
