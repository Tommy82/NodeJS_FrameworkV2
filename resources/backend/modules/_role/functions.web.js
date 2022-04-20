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
    static delete = deleteRole;
}

/**
 * Ausgabe - Liste aller Rollen
 * @param {*} req Website - Request
 * @param {*} res Website - Response
 * @returns {Promise<void>}
 */
async function getList(req, res) {
    try {

        let params = new app.frontend.parameters();

        params.header = ["ID", "Key", "Name", "Beschreibung", "Menü"];
        params.sql = "SELECT `id`, `key`, `name`, `desc` FROM `roles` ";
        params.where = "id > 0";
        params.addAdd = true;
        params.url_fastsave = app.settings.webServer.prefix + '/backend/role/0';

        // Menü
        params.menu = '';
        if ( app.helper.check.rights.bySession(req, Role.moduleName, "change")) {
            params.menu += `<a class="toOverlay" href='${app.settings.webServer.prefix}/backend/role/%id%?overlay=1'><img src="${app.web.prefix}/base/images/icons/edit.png" alt="" class="icon" href='${app.web.prefix}/backend/role/%id%'></a>`;
        }

        // Wenn Löschen erlaubt, setze Button für Löschen
        if (app.helper.check.rights.bySession(req, Role.moduleName, "delete")) {
            params.menu += `<a href="${app.settings.webServer.prefix}/backend/role/%id%/del" value1="Rolle" value2="%id%" value3="%name%" class="btnDelete""><span><img src="${app.web.prefix}/base/images/icons/delete.png" alt="" class="icon"></a></span>`;
        }

        app.frontend.table.generateByDB('tblRoles', "TAB1", params, null)
            .then(response => {
                // Ausgabe
                app.web.toOutput(req, res, ["base"], "backend_tableDefault", response.params.output, true);
            })
            .catch(err => {
                app.logError(err, Role.moduleName + ":web:getList");
                app.web.toErrorPage(req, res, err, true, true, false);
            })
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
                    .then(response => {
                        params.output = response.params.output;
                        let tabRights = response.data;
                        params.appendBeforeSaveButtons = tabRights;

                        app.frontend.table.generateEditByID(params, null)
                            .then(response => {
                                params = response.params;
                                params.addData('TAB_EDIT', response.data);
                                params.addData('TAB_RIGHTS', tabRights);
                                params.addData("AUTOCOMPLETE", []);

                                app.web.toOutput(req, res, ["base"], "backend_tableEditDefault", params.output, true);
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

async function deleteRole(req, res)  {
    let id = req.params.id;
    let allowed = true;

    Role.database.getByID(id)
        .then(lstRoles => {
            if ( lstRoles && lstRoles.length > 0 ) {
                let key = lstRoles[0].key;

                app.modules.account.database.getByRole(key)
                    .then(lstAccounts => {
                        if ( lstAccounts && lstAccounts.length > 0 ) {
                            app.log('Kann nicht gelöscht werden - Accounts vorhanden');
                        } else {
                            Role.database.deleteByID(id)
                                .then(response => {
                                    Functions.getList(req, res).catch(err => { app.logError(err); })
                                })
                                .catch(err => {
                                    app.logError(err);
                                    app.web.toErrorPage(req, res, err, true, true, false);
                                })
                        }
                    })
                    .catch(err => {
                        app.logError(err);
                        app.web.toErrorPage(req, res, err, true, true, false);
                    })
            }
        })
        .catch(err => {
            app.logError(err);
            app.web.toErrorPage(req, res, err, true, true, false);
        })

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
        {
            key: "name",
            type: "text",
            name: "Name",
            check: "notempty",
            fastSave: true,
            inList: true
        },
        {
            key: "desc",
            type: "text",
            name: "Beschreibung",
            check: "",
            description: 'Beschreibung der Rolle',
            fastSave: true,
            inList: true
        },
        {
            key: 'key',
            type: 'text',
            name: "Key",
            check: "notempty",
            fastSave: true,
            inList: true
        },
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
