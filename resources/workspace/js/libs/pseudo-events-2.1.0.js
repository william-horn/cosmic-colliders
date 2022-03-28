/*
? @document-start
======================
| PSEUDO EVENT CLASS |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          pseudo-events.js
? @document-created:       03/08/2022
? @document-modified:      03/28/2022
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

See documentation

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
class Connection extends DynamicState {
    constructor(connectionType, name, func) { // connectionType="type", name*="name", func=func
        [name, func] = [
            func ? name : undefined,
            func ? func : name
        ]

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

export default class PseudoEvent extends DynamicState {
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
        // data types BEFORE conversion
        let isFunc_connectionFunc = typeof connectionFunc === "function";
        let isFunc_connectionName = typeof connectionName === "function";

        const connections = this.connections;

        // arrange arguments to their intended values
        // todo: there's probably a better, more generalized way to do this. think of it later.
        // @note maybe use arrays to sort by type?
        [connectionName, connectionFunc, override] = [
            isFunc_connectionName
                ? undefined : connectionName,

            isFunc_connectionName
                ? connectionName : isFunc_connectionFunc
                ? connectionFunc : undefined,

            connectionFunc === true 
                ? connectionFunc : override
        ];

        // data types AFTER conversion
        const typeof_connectionName = typeof connectionName;
        const isObj_connectionName = typeof_connectionName === "object";
        const isStr_connectionName = typeof_connectionName === "string";

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

        // return filtered-out array of connections by name/function
        // return gutil.getAllOf(this.connections, val => {
        //     return val.isMutable(override)
        //         && (connectionName ? val.name === connectionName : true)
        //         && (connectionFunc ? val.source === connectionFunc : true)
        // });

        // * connectionName can be a string OR an object
        gutil.generalIteration(
            connections,
            val => val.isMutable(override)
                    && (isStr_connectionName ? val.name === connectionName : true)
                    && (connectionFunc ? val.source === connectionFunc : true)
                    && (isObj_connectionName ? (connectionName === val) : true),

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

    resume(name, func, override) {
        this.applyFilter(name, func, override, resumer);
    }

    trigger(...args) {
        if (!this.hasPermissionToFire()) return;
        const connections = this.connections;

        for (let i = 0; i < connections.length; i++) {
            const connection = connections[i];
            if (connection.isState("listening")) connection.source(...args);
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