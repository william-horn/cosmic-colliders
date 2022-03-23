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

const grandparentEvent = new PseudoEvent();
const parentEvent = new PseudoEvent(grandparentEvent);
const childEvent = new PseudoEvent(parentEvent);

const f_0 = () => console.log("fired 1!")


const conn = childEvent.strongConnect(f_0);
childEvent.disconnect(conn);

childEvent.fire();

console.log(childEvent);



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
