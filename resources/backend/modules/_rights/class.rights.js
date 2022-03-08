import { app } from "../../system/class.app.js";

export default class Rights {
    static moduleName = 'Rights';

    constructor() {
    }

    static database = {
        getAll: databaseGetAll,
        getByID: databaseGetById,
        getByName: databaseGetByName,
        save: databaseSave
    };
}

//#region Functions - Database
/**
 * Lädt alle Rechte aus der Datenbank (db:rights)
 * @param {boolean} onlyActive Nur aktive Rechte laden ?
 */
function databaseGetAll(onlyActive = false) {
    return new Promise((resolve, reject) => {
        app.DB.findAll('rights')
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Lädt einen einzelnen Datensatz anhand der ID
 * @param {int} id interne ID des Accounts (db:account.id)
 * @returns {Promise<unknown>}
 */
function databaseGetById(id) {
    return new Promise((resolve, reject) => {
        app.DB.findById('rights', [id])
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Lädt alle Datensätze des Accounts mit dem angegebenem LoginNamen (Sollte nur einer sein!)
 * @param {string} name LoginName / Benutzername (db:account.name)
 * @returns {Promise<unknown>}
 */
function databaseGetByName(name) {
    return new Promise((resolve, reject) => {
        app.DB.find('rights', { name: name })
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Speichert einen Datensatz in der AccountDatenbank
 * @param {*} document Datensatz (db:account)
 * @returns {Promise<unknown>}
 */
function databaseSave(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert('rights', document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}
//#endregion Functions - Database