/**
 * Module to allow passing of event data.
 */

// About '...': https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

let dataTemplate = {
    element: null,
    eventType: null,
    payload: null,
    metadata: null,
};
let data;

function setEventData(element, eventType, payload = null, metadata = null) {
    data = { ...dataTemplate, // Using the template, rewrite stuff
        ...{
            element: element,
            eventType: eventType,
            payload: payload,
            metadata: metadata,
        }
    };
}

function getEventData(reset = true) {
    let toReturn = data;
    if(reset) {
        data = {
            ...dataTemplate
        };
    }
    return toReturn;
}

export default {
    setEventData,
    getEventData
}
