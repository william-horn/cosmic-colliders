
# Pseudo Events

The `PseudoEvent` class allows you to create event-like objects that group a bunch of functions together to be handled and called when an event is fired. The trigger for the PseudoEvent can correspond to an actual Javascript event, or be completely simulated (like with `setInterval`, for example).

Here is an example of creating a somewhat unnecessary event, while demonstrating it's potential:

```javascript
import PseudoEvent from "..."; // import class

let event = new PseudoEvent(); // create new pseudo-event listener

// connect some anonymous functions to this event listener
event.connect( () => console.log("event 1 was fired!") );
event.connect( () => console.log("event 2 was fired!") );

event.fire(); 
// => "event 1 was fired!"
// => "event 2 was fired!"
```

By using `event.connect`, you schedule a new function to be called when the event is fired. These scheduled functions are callbacks, and you can pass arguments to them when an event is fired:

_continuation of previous example:_

```javascript
event = new PseudoEvent();

event.connect((arg1, arg2) => {
    console.log("received:", arg1, arg2, "from event!")
});

event.fire("Hello", "World!");
// => "received: Hello  World  from event!"
```

Here's an example of creating a timer event. The following event will fire every second, allowing you to attach functions to be called when the event is fired.

```javascript
const timeEvent = new PseudoEvent();
const secondsCounter = 0;

// display the current time every second
timeEvent.connect( 
    currentTime => console.log("The current time is: ", currentTime)
);

// increment the secondsCounter variable by 1 every second
timeEvent.connect(
    () => secondsCounter++
);

// fire the event every second
setInterval( 
    () => timeEvent.fire(new Date()),
    1000 
)
```

