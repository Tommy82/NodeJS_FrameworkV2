/**
 * Prüfungsfunktionen für die Rechteverwaltung
 *
 * @module:     Account
 * @version:    1.0
 * @revision:   1
 * @author:     Thomas Göttsching
 * @company:    Thomas Göttsching
 *
 * Wichtiger Hinweis: Änderungen an dieser Datei können die Updatefähigkeit beeinträchtigen.
 * Daher wird dringend davon abgeraten!
 */

import {app} from "../../system/class.app.js";

export class Functions {
    static bySession = bySession;
    static byRole = byRole;
}

/**
 * Prüft einen angemeldeten Benutzer, ob dieser ein entsprechendes Recht hat
 * - Hinweis: Diese Funktion wurde der globalen Hilfsklasse hinzugefügt!
 * @param {*} req Website - Request (beinhaltet die User session)
 * @param {string} moduleName Name des Moduls
 * @param {string} key Key des Rechts (db:rights.key)
 * @example if (app.helper.check.rights.bySession(req, Role.moduleName, "change")) { 'DO STUFF' }
 * @returns {boolean}
 */
function bySession(req, moduleName, key) {
    let response = false;
    if ( req && req.session && req.session.user && req.session.user.role ) {
        response = byRole(req.session.user.role, moduleName, key);
    }
    return response;
}

/**
 * Prüft, ob eine bestimmte Rolle ein entsprechendes Recht hat
 - Hinweis: Diese Funktion wurde der globalen Hilfsklasse hinzugefügt!
 * @param {string} role Key der Rolle (db:role.key)
 * @param {string} moduleName Name des Moduls
 * @param {string} key Key des Rechts (db:rights.key)
 * @example if (app.helper.check.rights.byRole("admin", Role.moduleName, "change")) { 'DO STUFF' }
 * @returns {boolean}
 */
function byRole(role, moduleName, key) {
    let response = false;

    let found = app.roles.find(x => x.key === role);
    if ( found ) {
        let foundRight = found.rights.find(x => x.module === moduleName && x.key === key);
        if ( foundRight && (foundRight.allowed === true || foundRight.allowedRole === true )) {
            response = true;
        }
    }

    return response;
}
