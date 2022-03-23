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
import { PseudoEvent, Connection } from "./libs/pseudo-events-2.1.0.js";

// ! TESTING CODE, REMOVE LATER 
// ! This is just here to test the libraries and make sure they're running smoothly


// event testing

const EventHandler = new PseudoEvent();
const clickEvent = new PseudoEvent(EventHandler);
const hoverEvent = new PseudoEvent(EventHandler);

const f_0 = arg => console.log("event 0 fired with arg:", arg);
const f_1 = arg => console.log("event 1 fired with arg:", arg);
const f_2 = arg => console.log("event 2 fired with arg:", arg);


// EventHandler.add("click", "name", object, f_0);
// make 'eventClick'
clickEvent.connect(f_0);

// EventHandler.remove("click", "name", f_0)


// EventHandler.add("hover", object, f_1);
hoverEvent.connect(f_1);

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
