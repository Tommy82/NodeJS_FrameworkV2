import { app } from "../../system/class.app.js";

export default class Role {
    static moduleName = 'Role';

    constructor() {
    }

    /**
     *  Datenbankeinstellungen für die Rollen
     */
    static database = {
        getAll: databaseGetAll,
        getByID: databaseGetById,
        getByKey: databaseGetByKey,
        save: databaseSave
    };

    static web = {
        getList: webGetList,
    }

    static sync = {
        all: syncAll,
    }
}

//#region Functions - Database
/**
 * Lädt alle Rollen aus der Datenbank
 * @param {boolean} onlyActive Nur aktive Rollen laden?
 */
function databaseGetAll(onlyActive = false) {
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
function databaseGetById(id) {
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
function databaseGetByKey(key) {
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
function databaseSave(document) {
    return new Promise((resolve, reject) => {
        app.DB.upsert('roles', document)
            .then(data => { return resolve(data); })
            .catch(err => { return reject(err); })
    })
}
//#endregion Functions - Database

//#region Functions - Sync
async function syncAll() {
    app.roles = await Role.database.getAll().catch(err => { app.logError(err, Role.moduleName); });
}
//#endregion Functions - Sync

//#region Functions - Web
function webGetList(req, res) {

    let data = {
        header: [
            { value: "column1" },
            { value: "column2" },
            { value: "column3" },
        ],
        content: [
            { value: "col1" },
            { value: "col2" },
            { value: "col3" },
        ],
        footer: []
    }

    let table = app.frontend.table.generate("test", data.header, data.content, data.footer);

    app.web.toTwigOutput(req, res, ["modules", "_role"], "list", { TAB1: table }, true);
}
//#endregion Functions - Web