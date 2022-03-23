/*
? @document-start
======================
| PSEUDO EVENT CLASS |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          pseudo-events.js
? @document-created:       03/08/2022
? @document-modified:      03/22/2022
? @document-version:       v2.1.0

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

Event.connect("click", () => {}))           // can disconnect with: Event.disconnect("click")
Event.connect(() => {})                     // can only disconnect with: Event.disconnectAll()

Event.strongConnect("click", () => {})      // can only disconnect with: Event.disconnect("click", true)
Event.strongConnect(() => {})               // can only disconnect with: Event.disconnectAll(true)

Event.factoryConnect("click", () => {})     // cannot disconnect once set
Event.factoryConnect(() => {})              // cannot disconnect once set


const customEvent = new Event()

const connection1 = customEvent.connect( () => {} ) // connect just a function
const connection2 = customEvent.connect( "eventName", () => {} ) // connect a function with a given name

customEvent.disconnect(connection1) // disconnect a connection literal
customEvent.disconnect("eventName") // disconnect all events with name "eventName"
customEvent.disconnectAll() // disconnect all connections

customEvent.pause(connection2) // pause a connection literal (this connection won't fire until it's resumed)
customEvent.pause("eventName") // pause all events by name
customEvent.pauseAll() // pause all events

customEvent.resume(connection2) // resume connection literal
customEvent.resume("eventName") // resume connections by name
customEvent.resumeAll() // resume all connections

customEvent.fire(connection2, ...) // fire a connection literal with arguments '...'
customEvent.fire("eventName") // fire all connections by name with arguments '...'
customEvent.fire(...) // fire all connections with arguments '...'

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Make 'this' inside the Event.fire() callback refer to the object that the Event object is inside of
-   Allow Connection object to be passed to 'disconnect' as a literal for individual disconnections
-   Add hierarchical event bubbling

==================================================================================================================================
*/

import DynamicState from "./dynamicstate-1.0.0.js";

const connectionStates = {
    "none": "none", // connection not made yet
    "factory": "factory", // immutable event (cannot disconnect)
    "strong": "strong", // mutable event; requires override
    "weak": "weak" // mutable event; does not require override
}

const eventStates = {
    "listening": "listening",
    "paused": "paused"
}

// read-only object
// contains connection information
class Connection extends DynamicState {
    constructor(connectionType, name, func=name) { // connectionType="type", name*="name", func=func
        super(eventStates);
        this.setState("listening");

        this.className = "Connection";
        this.name = name;
        this.source = func;
        this.connectionType = connectionType;
    }

    isMutable(override) {
        return this.connectionType === "weak" 
            || override && this.connectionType != "factory";
    }
}

export default class PseudoEvent extends DynamicState {
    constructor(eventName, eventParent) {
        super(eventStates);
        this.setState("listening");
        this.className = "PseudoEvent";

        this.name = eventName; // the name of this event
        this.parentEvent = eventParent; // the parent of this event

        this.connections = [];
        this.childEvents = [];
    }

    // check if parent event allows child event firing permission (if parent event exists, otherwise event always has permission)
    hasPermissionToFire() {
        return this.isState("listening")
            && this.parentEvent ? this.parentEvent.hasPermissionToFire() : true;
    }

    // disconnect all weak connections (and strong connections if override is given)
    disconnectAll(override) {
        arrayRemoveAllOf(
            this.connections, 
            val => val.isMutable(override)
        );
    }

    pauseAll() {
        this.setState("paused");
    }

    resumeAll() {
        this.setState("listening");
    }

    getConnectionsFromArgs(connectionName, connectionFunc) {
        
    }

    // disconnect a weak connection (or a strong connection if override is given)
    disconnect(name, override) {
        arrayRemoveAllOf(
            this.connections, 
            val => val.name === name && val.isMutable(override)
        );
    }

    fire(...args) {
        if (!this.hasPermissionToFire()) return;

        const connections = this.connections;
        for (let i = 0; i < connections.length; i++) {
            const connection = connections[i];
            connections[i].source(...args);
        }
    }

    // private
    connectState(state, name, func) {
        const connection = new Connection(state, name, func);
        this.connections.push(connection);
    }

    // create weak connection
    connect(name, func) {
        this.connectState(connectionStates.weak, name, func);
    }

    // create strong connection
    strongConnect(name, func) {
        this.connectState(connectionStates.strong, name, func);
    }

    // create factory connection
    factoryConnect(name, func) {
        this.connectState(connectionStates.factory, name, func);
    }
}
