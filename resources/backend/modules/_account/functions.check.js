/**
 * Prüffunktionen des Moduls [Account]
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

import { Functions as fDatabase } from './functions.database.js';

export class Functions {
    static canDelete = canDelete;
}

/**
 * Prüfung ob der Benutzer gelöscht werden kann
 * ToDo: andere Tabellen prüfen!
 * ToDo: andere Module drauf zugreifen lassen
 * @param id
 * @returns {Promise<unknown>}
 */
async function canDelete(id) {
    return new Promise((resolve, reject) => {
        // Laden des Datensatzes
        fDatabase.getByID(id)
            .then(account => {
                let canDelete = true;

                // Prüfen ob Datensatz vorhanden
                if ( account && account.length > 0 ) {
                    // Setzen des ersten Datensatzes
                    account = account[0];

                    // Prüfe ob Benutzer = Admin Account
                    if ( account.name === 'admin' ) {
                        canDelete = false;
                    }

                    return resolve(canDelete);
                } else {
                    return reject("Account nicht gefunden!");
                }
            })
            .catch(err => { return reject(err); })
    })
}