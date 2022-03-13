import { app } from "./class.app.js";

export class Check {
    isNumeric = isNumeric;
    rights = rights;
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

/**
 * Prüfung, ob ein Benutzer ein bestimmtes Recht hat
 * @param {*} user UserSession (wichtig: user.role)
 * @param {string} moduleName Name des Moduls
 * @param {string} right Key des Rechts
 */
function rights(user, moduleName, right) {
    //TODO Abfrage erstellen!
    return true;
}