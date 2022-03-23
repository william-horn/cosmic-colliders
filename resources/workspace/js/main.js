/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 James Primitive (Christopher J. Hoke), William J. Horn
? @document-name:          main.js
? @document-created:       03/22/2022
? @document-modified:      03/22/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
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

/* ---------------- */
/* Import Libraries */
/* ---------------- */
import debouncer from "./libs/debounce-1.0.0.js";
import PseudoEvent from "./libs/pseudo-events-2.1.0.js";
import datastore from "./libs/datastore-1.0.0.js";
import EventHandler from "./libs/event-handler.1.1.0.js";

// ! TESTING CODE, REMOVE LATER 
// ! This is just here to test the libraries and make sure they're running smoothly



/* -------------- */
/* debouncer test */
/* -------------- */

// function test() {
//     console.log("function code running")
//     // this.open();
//     // debouncer.getDebounceData(test).open();
//     debounceData.open();
// }

// const debouncedFunction = debouncer.debounce(test);
// const debounceData = debouncer.getDebounceData(test);
// debouncedFunction(); // initial run

// debounceData.setStateTimeout("open", 5000);
// setInterval(() => debouncedFunction(), 1000);
// setTimeout(() => debounceData.close(true), 8000);

/* ------------------ */
/* pseudo events test */
/* ------------------ */

// const eventObject = new PseudoEvent();

// eventObject.connect(() => console.log("anonymous connect test"));
// eventObject.connect("eventName", () => console.log("anonymous with event name"));

// eventObject.fire();
// eventObject.disconnect("eventName")
// eventObject.fire();
// eventObject.disconnectAll();
// eventObject.fire();


/* -------------- */
/* datastore test */
/* -------------- */

// datastore.get("testdata1");
// datastore.update("testdata1", oldData => {
//     oldData[0] = true;
//     return oldData;
// })
// console.log(datastore.get("testdata1"))


/* ------------------------- */
/* Global Element References */
/* ------------------------- */

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */

/* ---------------------- */
/* General Util Functions */
/* ---------------------- */

/* ------------------------ */
/* Dedicated Util Functions */
/* ------------------------ */

/* ------------------------ */
/* Event Callback Functions */
/* ------------------------ */


/* -------------------------- */
/* Connect Js Event Listeners */
/* -------------------------- */
