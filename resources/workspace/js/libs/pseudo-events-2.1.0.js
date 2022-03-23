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
customEvent.disconnect("eventName", func)
customEvent.disconnect(func)
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
-   Allow Connection object to be passed to 'disconnect' as a literal for individual disconnections --DONE
-   Add hierarchical event bubbling

==================================================================================================================================
*/

import gutil from "./gutil-1.0.0.js";
import DynamicState from "./dynamicstate-1.0.0.js";

const connectionTypes = {
    "none": "none", // connection not made yet
    "factory": "factory", // immutable event (cannot disconnect)
    "strong": "strong", // mutable event; requires override
    "weak": "weak" // mutable event; does not require override
}

const eventStates = {
    "listening": "listening",
    "paused": "paused"
}

// private methods of PseudoEvent
function disconnector(key) {
    this.connections.splice(key, 1);
}

function pauser(key) {
    this.connections[key].setState("paused");
}

function resumer(key) {
    this.connections[key].setState("listening");
}

// read-only object
// contains connection information
export class Connection extends DynamicState {
    constructor(connectionType, name, func=name) { // connectionType="type", name*="name", func=func
        super(eventStates);
        this.setState("listening");

        this.className = "Connection";
        this.name = name;
        this.source = func;
        this.connectionType = connectionTypes[connectionType] || connectionTypes.none;
    }

    isMutable(override) {
        return this.connectionType === "weak" 
            || override && this.connectionType != "factory";
    }
}

export class PseudoEvent extends DynamicState {
    constructor(eventName, eventParent) {
        // arrange args
        const typeof_eventName = typeof eventName;
        [eventName, eventParent] = [
            typeof_eventName === "object"
                ? undefined : eventName,

            eventParent
                ? eventParent : (typeof_eventName === "object") 
                ? eventName : undefined
        ]

        // call superclass
        super(eventStates);

        // add event to parent child list if parent exists
        if (eventParent) eventParent.childEvents.push(this)

        // initialize 
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
            && (this.parentEvent ? this.parentEvent.hasPermissionToFire() : true);
    }

    // disconnect all weak connections (and strong connections if override is given)
    disconnectAll(override) {
        gutil.arrayRemoveAllOf(
            this.connections, 
            val => val.isMutable(override)
        );
    }

    // todo: implement override pause/resume all mechanic
    pauseAll(override) {
        this.setState("paused");
    }

    resumeAll(override) {
        this.setState("listening");
    }

    applyFilter(connectionName, connectionFunc, override, action) {
        const typeof_connectionName = typeof connectionName;
        const typeof_connectionFunc = typeof connectionFunc;
        const connections = this.connections;

        // arrange arguments to their intended values
        // todo: there's probably a better, more generalized way to do this. think of it later.
        // @note maybe use arrays to sort by type?
        [connectionName, connectionFunc, override] = [
            typeof_connectionName === "function"
            ? undefined : connectionName,

            typeof_connectionName === "function"
            ? connectionName : typeof_connectionFunc === "function"
            ? connectionFunc : undefined,

            connectionFunc === true 
                ? connectionFunc : override
        ];

        // the above logic will produce:
        //
        // args:                                         connectionName  connectionFunc  override
        //
        // applyFilter(connection, true)         =>      connection,     undefined,      true
        // applyFilter("eventName", true)        =>      "eventName",    undefined,      true
        // applyFilter(f, true)                  =>      undefined,      f,              true
        // applyFilter("eventName", f, true)     =>      "eventName",    f,              true
        // applyFilter(connection)               =>      connection,     undefined,      undefined
        // applyFilter("eventName")              =>      "eventName",    undefined,      undefined
        // applyFilter("eventName", f)           =>      "eventName",    f,              undefined
        // applyFilter(f)                        =>      undefined,      f,              undefined

        // Connection literal => [Connection]
        // fastest option
        if (typeof_connectionName === "object" && connectionName.isMutable(override)) {
            for (let i = 0; i < connections.length; i++) {
                if (connections[i] === connectionName) {
                    connections.splice(i, 1);
                    return;
                }
            }
        }

        // return filtered-out array of connections by name/function
        // return gutil.getAllOf(this.connections, val => {
        //     return val.isMutable(override)
        //         && (connectionName ? val.name === connectionName : true)
        //         && (connectionFunc ? val.source === connectionFunc : true)
        // });

        gutil.generalIteration(
            connections,
            val => {
                return val.isMutable(override)
                    && (connectionName ? val.name === connectionName : true)
                    && (connectionFunc ? val.source === connectionFunc : true)
            },
            result => result, 
            key => action.call(this, key)
        );
    }

    // disconnect a weak connection (or a strong connection if override is given)
    disconnect(name, func, override) {
        this.applyFilter(name, func, override, disconnector);
    }

    pause(name, func, override) {
        this.applyFilter(name, func, override, pauser);
    }

    resume(name, func) {
        this.applyFilter(name, func, override, resumer);
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
        return connection;
    }

    // create weak connection
    connect(name, func) {
        return this.connectState(connectionTypes.weak, name, func);
    }

    // create strong connection
    strongConnect(name, func) {
        return this.connectState(connectionTypes.strong, name, func);
    }

    // create factory connection
    factoryConnect(name, func) {
        return this.connectState(connectionTypes.factory, name, func);
    }
}
