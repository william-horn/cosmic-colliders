/*
? @document-start
========================
| EVENT HANDLER MODULE |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          event-handler.js
? @document-created:       03/16/2022
? @document-modified:      03/16/2022
? @document-version:       v1.0.0

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

-   Add support for jQuery --DONE
-   Add pause/resume functionality to events --DONE
-   Generalize the retrieval of data from a map/array (maybe as a new utility for gutil?) with a callback
-   Debating use of classes for main EventHandler module

==================================================================================================================================
*/

import DynamicState from "./dystates-1.0.0.js";

// jQuery support for events
const eventConnectorName = window.jQuery ? "on" : "addEventListener";
const eventDisconnectorName = window.jQuery ? "off" : "removeEventListener";

const eventHandlerStates = {
    "listening": "listening",
    "paused": "paused"
}

function interpretArgs(typeList, ...args) {
    let argListStr = [...args];

    for (let i = 0; i < argListStr.length; i++) {
        argListStr[i] = typeof argListStr[i];
    }

    return argListStr.toString();
}

function findAll(arr, callback) {
    const list = [];
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        const result = callback(val);
        if (!result === undefined) list.push(val);
    }
    return list;
}

class Listener extends DynamicState {
    constructor(eventType, eventName, objRef, func, funcHandler) {
        super(eventHandlerStates);
        this.className = "Listener";
        this.setState("listening");

        this.name = ""; // arbitrary, optional event name alias
        this.type = ""; // name of the event type
        this.objRef = ""; // actual reference to the object
        this.callback = ""; // callback function given by the developer
        this.handler = "" // handler function that wraps the callback function
    }  
}

export default class EventHandler extends Listener {
    constructor() {
        super();
        this.className = "EventHandler";

        /* 
            this.connections = [
                ListenerObject,
                ListenerObject,
                ListenerObject,
            ]

            this.listeners = {
                "click": ListenerObject
            }
        */
        this.connections = []; 
        this.listeners = {};
    }

    config(eventType, eventName, guiObject) {
        [eventType, eventName, guiObject] = [
            eventType,
            typeof eventName === "object" ? null : eventName,
            typeof eventName === "string" ? guiObject : eventName
        ];

        if (typeof eventType === "object") return [eventType]; // if first and only argument is the Listener OBJECT
        if (!eventName && !guiObject) return [this.listeners[eventType]]; // if first and only argument is the listener TYPE

        return findAll(this.connections, listener => {
            return listener.type === eventType
                && listener.name === eventName || listener.name
                && listener.objRef === guiObject || listener.objRef;
        });
    }

    // EventHandler.remove/pause/resume("click")
    // EventHandler.remove/pause/resume("click", "name")
    // EventHandler.remove/pause/resume("click", "name", object)
    // EventHandler.remove/pause/resume("click", object)
    // EventHandler.remove/pause/resume(ListenerObject)
    remove(eventType, eventName, guiObject) {
        const listeners = this.config(eventType, eventName, guiObject);

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

        const cachedEventType = this.listeners[eventType];
        if (!cachedEventType) {
            this.listeners[eventType] = new Listener(

            );
        }

    }

    pause(...args) {
        this.config("pause", ...args);
    }

    // remove(...args) {
    //     this.config("remove", ...args);
    // }
}
