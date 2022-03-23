/**
 * Frontend Funktionen - Autocomplete
 *
 * @module:     System
 * @version:    1.0
 * @revision:   1
 * @author:     Thomas Göttsching
 * @company:    Thomas Göttsching
 *
 * Wichtiger Hinweis: Änderungen an dieser Datei können die Updatefähigkeit beeinträchtigen.
 * Daher wird dringend davon abgeraten!
 */

import {app} from "./class.app.js";

export class Functions {
    static afterStart = afterStart;
}

/**
 * Frontend Aktionen, welche nach dem Start der Anwendung ausgeführt werden sollen
 */
function afterStart() {
    // Füge Autocomplete Filter hinzu
    app.web.addRoute("get", "/backend/autocomplete/:filter/:search", fAutocomplete, false, true);
    //app.web.addRoute("get", "/autocomplete/:filter/:search", fAutocomplete, false, false); // ToDo: Frontend einbinden
}

/**
 * Autocomplete Funktion
 * @param {*} req Website - Request
 * @param {*} res Website - Response
 * @returns {Promise<*>}
 */
async function fAutocomplete(req, res) {
    // ToDo: unterscheidung zwischen Frontend und Backend Filter (Sicherheit!)
    let filter = req.params.filter;
    let search = req.params.search;
    let response = [];
    if ( filter !== null && filter !== '' ) {
        let found = app.frontend.autocomplete.find(x => x.filter === filter);
        if ( found ) {
            response = await found.callback(search);
        }
    }
    return res.json(response);
}
