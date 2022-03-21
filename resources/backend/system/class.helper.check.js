import { app } from "./class.app.js";

export class Check {
    isNumeric = isNumeric;
};

/**
 * Prüft ob ein String eine Zahl ist (Float)
 * @param str
 * @returns {boolean}
 */
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
