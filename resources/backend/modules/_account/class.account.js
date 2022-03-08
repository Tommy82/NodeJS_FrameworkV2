import { app } from "../../system/class.app.js";

export default class Account {
    static moduleName = 'Account';

    constructor() {
    }

    static database = {
        getByID: databaseGetById,
        getByName: databaseGetByName,
        save: databaseSave
    };
}

//#region Functions - Database

/**
 * Lädt einen einzelnen Datensatz anhand der ID
 * @param {int} id interne ID des Accounts (db:account.id)
 * @returns {Promise<unknown>}
 */
function databaseGetById(id) {
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
function databaseGetByName(name) {
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
function databaseSave(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert('account', document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}
//#endregion Functions - Database


