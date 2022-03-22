/*
? @document-start
======================
| PSEUDO EVENT CLASS |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          pseudo-events.js
? @document-created:       03/08/2022
? @document-modified:      03/16/2022
? @document-version:       v2.0.0

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

-   Make 'this' inside the Event.fire() callback refer to the object that the Event object is inside of

==================================================================================================================================
*/

/*
Event.connect("click", () => {}))           // can disconnect with: Event.disconnect("click")
Event.connect(() => {})                     // can only disconnect with: Event.disconnectAll()

Event.strongConnect("click", () => {})      // can only disconnect with: Event.disconnect("click", true)
Event.strongConnect(() => {})               // can only disconnect with: Event.disconnectAll(true)

Event.factoryConnect("click", () => {})     // cannot disconnect once set
Event.factoryConnect(() => {})              // cannot disconnect once set
*/

import DynamicState from "./dystates-1.0.0.js";

const connectionStates = {
    "factory": "factory", // immutable event (cannot disconnect)
    "strong": "strong", // mutable event; requires override
    "weak": "weak" // mutable event; does not require override
}

class Connection extends DynamicState {
    constructor(name, func=name) {
        super(connectionStates);
        this.className = "Connection";
        this.name = name;
        this.source = func;
    }

    isMutable(override) {
        return this.isState("weak") || override && !this.isState("factory");
    }
}

export default class PseudoEvent {
    constructor() {
        this.className = "PseudoEvent";
        this.connections = [];
    }

    disconnectAll(override) {
        const connections = this.connections;
        for (let i in connections) {
            const connection = connections[i];
            if (connection.isMutable(override)) {
                connections.splice(i, 1);
            }
        }
    }

    disconnect(name, override) {
        const connections = this.connections;
        for (let i in connections) {
            const connection = connections[i];
            if (connection.name === name && connection.isMutable(override)) {
                connections.splice(i, 1);
            }
        }
    }

    fire(...args) {
        const connections = this.connections;
        for (let i = 0; i < connections.length; i++) {
            connections[i].source(...args);
        }
    }

    // private
    connectState(state, name, func) {
        const connection = new Connection(name, func);
        connection.setState(state);
        this.connections.push(connection);
    }

    // create weak connection
    connect(name, func) {
        this.connectState("weak", name, func);
    }

    // create strong connection
    strongConnect(name, func) {
        this.connectState("strong", name, func);
    }

    // create factory connection
    factoryConnect(name, func) {
        this.connectState("factory", name, func);
    }
}
