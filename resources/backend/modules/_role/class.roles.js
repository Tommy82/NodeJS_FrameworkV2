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
        autocomplete: webAutoComplete,
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
async function webGetList(req, res) {
    let params = [];
    params["header"] = ["ID", "Modul", "Schlüssel", "Beschreibung", "StandardRolle", "Menü"];
    params["sql"] = "SELECT `id`, `moduleName`, `key`, `desc`, `defaultRole` FROM `rights`";
    params["where"] = "id > 0";
    params["menu"] = `<a href='/backend/roles/%id%'>test</a>`;

    let autocomplete = [{fieldID: "role", filter: "role"}];

    app.frontend.table.generateByDB('tblRoles', params, null)
        .then(table => {
            let js = "setDataTable('tblRoles');";
            app.web.toTwigOutput(req, res, ["modules", "_role"], "list", { TAB1: table, JS: js, AUTOCOMPLETE: autocomplete }, true);
        })
        .catch(err => { console.error(err); });
}

async function webAutoComplete(search) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT `id`, `name` FROM `roles` ";
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
                        response.push(`${item.id} | ${item.name}`);
                    })
                }
                console.log(response);
                return resolve(response);
            })
            .catch(err => { return reject(err); })
    })
}
//#endregion Functions - Web