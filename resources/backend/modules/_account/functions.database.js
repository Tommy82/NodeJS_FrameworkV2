/**
 * Datenbankfunktionen des Moduls [Account]
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

/** Funktionsklasse zur verwaltung der export Funktionen in dieser Datei **/
export class Functions {
    static getByID = getById;
    static getByName = getByName;
    static save = save;
}

/**
 * Lädt einen einzelnen Datensatz anhand der ID
 * @param {int} id interne ID des Accounts (db:account.id)
 * @returns {Promise<unknown>}
 */
function getById(id) {
    return new Promise((resolve, reject) => {
        app.DB.findById('account', [id])
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Lädt alle Datensätze des Accounts mit dem angegebenem LoginNamen (Sollte nur einer sein!)
 * @param {string} name LoginName / Benutzername (db:account.name)
 * @returns {Promise<unknown>}
 */
function getByName(name) {
    return new Promise((resolve, reject) => {
        app.DB.find('account', { name: name })
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Speichert einen Datensatz in der AccountDatenbank
 * @param {*} document Datensatz (db:account)
 * @returns {Promise<unknown>}
 */
function save(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert('account', document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}
