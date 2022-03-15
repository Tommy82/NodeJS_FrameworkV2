import {app} from "../../system/class.app.js";

/**
 * Lädt alle Rollen aus der Datenbank
 * @param {boolean} onlyActive Nur aktive Rollen laden?
 */
export function databaseGetAll(onlyActive = false) {
    return new Promise((resolve, reject) => {
        app.DB.findAll('roles')
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Lädt einen einzelnen Datensatz anhand der ID
 * @param {int} id interne ID des Accounts (db:account.id)
 * @returns {Promise<unknown>}
 */
export function databaseGetById(id) {
    return new Promise((resolve, reject) => {
        app.DB.findById('roles', [id])
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Lädt einen Datensatz anhand des "keys" (db: roles.key)
 * @param {string} name LoginName / Benutzername (db:account.name)
 * @returns {Promise<unknown>}
 */
export function databaseGetByKey(key) {
    return new Promise((resolve, reject) => {
        app.DB.find('roles', { key: key })
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Speichert einen Datensatz in der RolesDatenbank
 * @param {*} document Datensatz (db:roles)
 * @returns {Promise<unknown>}
 */
export function databaseSave(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert('roles', document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

export function databaseRightsGetAll(roleID) {
    return new Promise((resolve, reject) => {
        app.DB.find("rolesRights", { roleID: roleID})
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

export function databaseRightsSave(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert("rolesRights", document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}