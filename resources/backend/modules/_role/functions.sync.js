/**
 * Synchronisierungsfunktionen
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
import Role from "./class.role.js";

export class Functions {
    static all = syncAll;
}

/**
 * Synchronisiert alle Rollen mit der globalen App
 * @returns {Promise<void>}
 */
async function syncAll() {
    app.roles = await Role.database.getAll().catch(err => { app.logError(err, Role.moduleName); });
    if ( app.roles ) {
        for ( let i = 0; i < app.roles.length; i++ ) {
            app.roles[i].rights = await Role.database.rightsGetAll(app.roles[i].id);
        }
    }
}
