/**
 * Datenbankfunktionen des Moduls [Role]
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
    static getAll = getAll;
    static getByID = getById;
    static getByKey = getByKey;
    static save = save;
    static rightsGetAll = rightsGetAll;
    static rightsSave = rightsSave;
    static AutoCompleteRole = AutoCompleteRole;
    static deleteByID = deleteByID;
}

/**
 * Lädt alle Rollen aus der Datenbank
 * @param {boolean} onlyActive Nur aktive Rollen laden?
 */
function getAll(onlyActive = false) {
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
function getById(id) {
    return new Promise((resolve, reject) => {
        app.DB.findById('roles', [id])
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Lädt einen Datensatz anhand des "keys" (db:roles.key)
 * @params {string} key Interner Key der Rolle (db:roles.key)
 * @returns {Promise<unknown>}
 */
function getByKey(key) {
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
function save(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert('roles', document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Laden aller Rechte für diese Rolle
 * @param {int} roleID Interne ID der Rolle (db:role.id)
 * @returns {Promise<unknown>}
 */
function rightsGetAll(roleID) {
    return new Promise((resolve, reject) => {
        app.DB.find("rolesRights", { roleID: roleID})
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Speichern eines Rechts für eine Rolle
 * - Achtung! roleID + rightID müssen zwangsweise im document angegeben werden!
 * @param {*} document Datensatz in Datenbank (db:roleRights)
 * @returns {Promise<unknown>}
 */
function rightsSave(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert("rolesRights", document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Löschen einer Rolle
 * @param id
 */
function deleteByID(id) {
    return new Promise((resolve, reject) => {
        app.DB.deleteById('roles', id)
            .then(response => {
                app.DB.delete('rolesRights', { roleID: id})
                    .then(response => {
                        return resolve(response);
                    })
                    .catch(err => { return reject(err); })

            })
            .catch(err => { return reject(err); })
    })
}

/**
 * Autocomplete für den Filter "role"
 * @param search
 * @returns {Promise<unknown>}
 * @constructor
 */
async function AutoCompleteRole(search) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT `id`, `name`, `key` FROM `roles` ";
        if ( search ) {
            sql += ` WHERE \`name\` like '%${search.trim()}%' `;
            if ( app.helper.check.isNumeric(search)) {
                sql += ` OR \`id\` = ${parseInt(search)} `;
            }
        }
        sql += " limit 0, 5";
        app.DB.query(sql)
            .then(data => {
                let response = [];
                if ( data && data.length > 0 ) {
                    data.forEach(item => {
                        // response.push(`${item.id} | ${item.name}`); // TODO: Update Value, ggfl. Override nach senden
                        response.push(`${item.key}`);
                    })
                }
                return resolve(response);
            })
            .catch(err => { return reject(err); })
    })
}



