/**
 * Web Funktionen des Moduls [Role]
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
import { default as Role } from './class.role.js';
import { default as Rights } from '../_rights/class.rights.js';

export class Functions {
    static getList = getList;
    static getDetails = getDetails;
    static setDetails = setDetails;
}

/**
 * Ausgabe - Liste aller Rollen
 * @param {*} req Website - Request
 * @param {*} res Website - Response
 * @returns {Promise<void>}
 */
async function getList(req, res) {
    try {
        let params = [];
        params["header"] = ["ID", "Key", "Name", "Beschreibung", "Menü"];
        params["sql"] = "SELECT `id`, `key`, `name`, `desc` FROM `roles` ";
        params["where"] = "id > 0";
        if ( app.helper.check.rights.bySession(req, Role.moduleName, "change")) {
            params["menu"] = `<a class="toOverlay" href='/backend/role/%id%?overlay=1'><img src="/base/images/icons/edit.png" alt="" class="icon" href='/backend/role/%id%'></a>`;
        }

        let autocomplete = [{fieldID: "role", filter: "role"}];

        app.frontend.table.generateByDB('tblRoles', params, null)
            .then(table => {
                let js = "setDataTable('tblRoles');";
                app.web.toOutput(req, res, ["base"], "backend_tableDefault", { TAB1: table, JS: js, AUTOCOMPLETE: autocomplete }, true);
            })
            .catch(err => {
                app.logError(err, Role.moduleName + ":web:getList");
                app.web.toErrorPage(req, res, err, true, true, false);
            });
    } catch ( err ) {
        app.logError(err, Role.moduleName + ":web:getList");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

/**
 * Einzeldetails einer bestimmten Rolle
 * @param {*} req Website - Request
 * @param {*} res Website - Response
 * @returns {Promise<void>}
 */
async function getDetails(req, res) {
    try {
        let id = req.params.id;
        let params = setEditableData(req.params.id);

        //Role.database.rightsGetAll(id)
        Role.rights.getAllFromRole(id)
            .then(lstRights => {

                app.frontend.table.generateByObject(setEditableDataRights(lstRights))
                    .then(tabRights => {
                        params.appendBeforeSaveButtons = tabRights
                        app.frontend.table.generateEditByID(params, null)
                            .then(data => {
                                app.web.toOutput(req, res, ["base"], "backend_tableEditDefault", { TAB_EDIT: data, TAB_RIGHTS: tabRights, AUTOCOMPLETE: [] }, true);
                            })
                            .catch(err => {
                                app.logError(err, Role.moduleName + ":web:getList");
                                app.web.toErrorPage(req, res, err, true, true, false);
                            })
                    })
                    .catch(err => {
                        app.logError(err, Role.moduleName + ":web:getList");
                        app.web.toErrorPage(req, res, err, true, true, false);
                    })
            })
            .catch(err => {
                app.logError(err, Role.moduleName + ":web:getList");
                app.web.toErrorPage(req, res, err, true, true, false);
            })
    } catch ( err ) {
        app.logError(err, Role.moduleName + ":web:getDetails");
        app.web.toErrorPage(req, res, err, true, true, false);
    }

}

/**
 * Prüfung und Speichern der Einzeldetails der Rolle
 * @example http://[uri]/backend/role
 * @returns {Promise<void>}
 */
async function setDetails(req, res) {
    try {
        let params = setEditableData(req.params.id);

        params.body = req.body;

        app.frontend.table.saveEditByID(params, null)
            .then(async data => {
                params.savedData = data;
                if ( params.id === 0 && data.insertId > 0 ) { params.id = data.insertId; }

                await saveRights(params);
                //toAccountSingle(req, res, params, true);
                res.send({ success: "success", data: [] });
            })
            .catch(err => {
                app.logError(err, Role.moduleName + ":web:getList");
                app.web.toErrorPage(req, res, err, true, true, false);
            })
    } catch ( err ) {
        app.logError(err, Role.moduleName + ":web:setDetails");
        app.web.toErrorPage(req, res, err, true, true, false);
    }

}

/**
 * Speichern der einzelnen Rechte für die Rolle
 * @param params
 * @returns {Promise<unknown>}
 */
function saveRights(params) {
    return new Promise(async (resolve, reject) => {
        if (params.id === 0) {
            return reject("RoleID is null");
        }

        let sql = "UPDATE `roles_rights` SET `allowed` = 0 WHERE `roleID` = " + params.id;
        await app.DB.query(sql).catch(err => { return reject(err); })

        Rights.database.getAll(false)
            .then(async lstRights => {
                let errors = [];
                if ( lstRights && lstRights.length > 0 ) {
                    app.helper.lists.asyncForEach(lstRights, async (right) => {
                        if ( errors.length === 0 ) {
                            let allowed = params.body && params.body["allowed_" + right.id] ? params.body["allowed_" + right.id] : "";
                            if ( allowed && (allowed.toLowerCase() === "on" || allowed.toLowerCase() === "1")) {
                                let sql = "SELECT `allowed` FROM `roles_rights` WHERE `roleID` = " + params.id + " AND `rightID` = " + right.id;
                                let data = await app.DB.query(sql).catch(err => {
                                    errors.push(err);
                                });
                                if (!data || data.length === 0) {
                                    sql = "INSERT INTO `roles_rights` ( `roleID`, `rightID`, `allowed` ) VALUES ( " + params.id + ", " + right.id + ", 1 ) ";
                                } else {
                                    sql = "UPDATE `roles_rights` SET `allowed` = 1 WHERE `roleID` = " + params.id + " AND `rightID` = " + right.id;
                                }
                                await app.DB.query(sql).catch(err => { errors.push(err); })
                            }
                        }
                    })
                }
                if ( errors.length === 0 ) { return resolve(true); }
                else { return reject(errors); }

            })
            .catch(err => { return reject(err); })
    })
}

/**
 * Prüfung / Erstellung - Parameter
 * - für die Erstellung der Tabelle
 * - für Speicherung der Daten
 * @param {int} id Interne ID der Accounts (db:account.id)
 * @returns {*[]}
 */
function setEditableData(id, params = new app.frontend.parameters()) {
    params.columns = [
        { key: "name", type: "text", name: "Name", check: "notempty" },
        { key: "desc", type: "text", name: "Beschreibung", check: "", description: 'Beschreibung der Rolle' },
    ];
    params.table = "roles";
    params.id = id;
    return params;
}

/**
 *
 * @param data
 * @returns {*}
 */
function setEditableDataRights(data) {
    let response = new app.frontend.parameters();
    response.id = "tblRoleRights";
    response.header = ["Modul", "Schlüssel", "Autom. erlaubt", "Man. erlaubt"]
    response.columns = [
        { key: "module", type: "text", name: "Modul", editAble: false },
        { key: "key", type: "text", name: "", editAble: false },
        { key: "allowedRole", type: "checkbox", name: "", editAble: false },
        { key: "allowed", type: "checkbox", name: "", editAble: true, ident: 'allowed_%rightID%', value: getRoleRightValue, valueParamCount: 2, valueParam1: '%rightID%', valueParam2: data },
    ];
    response.orgObject = data;
    response.colCheckBox = [2,3];

    return response;
}

/**
 * Auswertung des aktuellen Status für EditTabelle der Rechte
 * @param rightID
 * @param orgObject
 * @returns {number}
 */
function getRoleRightValue(rightID, orgObject) {
    let response = 0;
    if ( orgObject && Array.isArray(orgObject)) {
        let found = orgObject.find(x => parseInt(x.rightID) === parseInt(rightID));
        if ( found && found.allowed === true ) { response = 1; }
    }
    return response;
}
