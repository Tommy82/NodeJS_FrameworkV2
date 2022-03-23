/**
 * Webfunktionen des Moduls [Account]
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
import {default as Account} from './class.account.js';
import {default as Role} from '../_role/class.role.js';

/** Funktionsklasse zur verwaltung der export Funktionen in dieser Datei **/
export class Functions {
    static toLogin = toLogin;
    static checkLogin = checkLogin;
    static toLogout = toLogout;
    static toAccountList = toAccountList;
    static toAccountSingle = toAccountSingle;
    static saveAccountSingle = saveAccountSingle;
}

/**
 * Starte Ausgabe - Login vom Backend
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
function toLogin(req, res) {
    try {
        // Ausgabe des Login - Templates
        app.web.toOutput(req, res, ["modules", "_account"], "login", {}, true);
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:webToLogin");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

/**
 * Prüft die Logindaten auf Richtigkeit
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
async function checkLogin(req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;

        if (username && password) {
            let loggedIn = false;

            let currData = await Account.database.getByName(username).catch(err => {
                throw err;
            });
            if (currData && currData.length > 0) {
                if (await app.helper.security.comparePassword(password, currData[0].password).catch(err => {
                    app.logError(err);
                })) {
                    loggedIn = true;
                }
            }
            if (loggedIn) {
                req.session.loggedIn_Backend = true;
                req.session.user = {
                    id: currData[0].id,
                    username: username,
                    role: currData[0].roles,
                }

                let redirect = req.query.redirect;
                if (redirect && redirect.trim() !== '') {
                    res.redirect(redirect);
                } else {
                    res.redirect("/backend");
                }
            } else {
                res.send("Falsche Zugangsdaten");
            }
            res.end();
        } else {
            res.send("Fehlende Benutzerdaten");
            res.end();
        }
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:checkLogin");
        app.web.toErrorPage(req, res, err, true, true, false);
    }

}

/**
 * Logout und Rückleitung zum Login Screen des Backends
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
function toLogout(req, res) {
    try {
        req.session.loggedIn_Frontend = null;
        req.session.loggedIn_Backend = null;
        res.redirect("/backend/login");
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:toLogout");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

/**
 * Starte Ausgabe - Listenansicht der Accounts
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
function toAccountList(req, res) {
    try {
        //#region Set Parameters
        let params = new app.frontend.parameters();
        params.header = ["ID", "Name", "Aktiv", "Backend", "Frontend", "Rollen", "Menü"];
        params.sql = "SELECT `id`, `name`, `active`, `isBackend`, `isFrontend`, `roles` FROM `account` ";
        params.where = "id > 0";
        params.menu = "";

        if (app.helper.check.rights.bySession(req, Account.moduleName, "change")) {
            params.menu += `<a class="toOverlay" href='/backend/account/%id%'><img src="/base/images/icons/edit.png" alt="" class="icon"></a>`;
        }
        params.colCheckbox = [2, 3, 4];
        params.addAdd = true;
        params.url_save = "/backend/account/0";
        //#endregion Set Parameters

        // Frontend Javascript
        let tableID = 'tblRoles';
        let js = `setDataTable('${tableID}');`;
        let title = "Benutzerverwaltung";

        app.frontend.table.generateByDB(tableID, params, null)
            .then(table => {
                app.web.toOutput(req, res, ["base"], "backend_tableDefault", {TAB1: table, JS: js, title: title}, true);
            })
            .catch(err => {
                console.error(err);
            });
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:toAccountList");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

/**
 * Starte Ausgabe - Detailansicht der Accounts
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 * @param params
 * @param canClose
 */
function toAccountSingle(req, res, params = [], canClose = false) {
    try {
        params = setEditableData(req.params.id, params);
        let autoComplete = [{fieldID: 'roles', filter: 'role'}];

        app.frontend.table.generateEditByID(params, null)
            .then(data => {
                app.web.toOutput(req, res, ["base"], "backend_tableEditDefault", {
                    TAB_EDIT: data,
                    AUTOCOMPLETE: autoComplete
                }, true);
            })
            .catch(err => {
                console.error(err);
            })
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:toAccountSingle");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

/**
 * Speichern - Speichern der Accountdaten
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
async function saveAccountSingle(req, res) {
    try {
        let params = setEditableData(req.params.id);

        params.body = req.body;

        params = await checkSaveData(params);
        if (!params || params.errors.length > 0) {
            res.send({success: "error", data: params.errors})
        } else {
            app.frontend.table.saveEditByID(params, null)
                .then(data => {
                    params.savedData = data;
                    //toAccountSingle(req, res, params, true);
                    res.send({success: "success", data: []});
                })
                .catch(err => {
                    console.error(err);
                })
        }
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:saveAccountSingle");
        app.web.toErrorPage(req, res, err, true, true, false);
    }

}

/**
 * Prüfung / Erstellung - Parameter
 * - für die Erstellung der Tabelle
 * - für Speicherung der Daten
 * @param {int} id Interne ID der Accounts (db:account.id)
 * @param params
 * @returns {*[]}
 */
function setEditableData(id, params = new app.frontend.parameters()) {
    params.columns = [
        {key: "name", type: "text", name: "Login-name", check: "notempty", fastSave: true},
        {key: "active", type: "checkbox", name: "Aktiv", check: "", fastSave: true},
        {
            key: "isBackend",
            type: "checkbox",
            name: "Login - Backend",
            description: 'Darf sich der User im Backend anmelden?',
            check: "",
            fastSave: true
        },
        {
            key: "isFrontend",
            type: "checkbox",
            name: "Login - Frontend",
            description: 'Darf sich der User im Frontend anmelden?',
            check: "",
            fastSave: true
        },
        {
            key: "roles",
            type: "text",
            name: "Rolle",
            check: "notempty",
            description: 'Welche Rolle hat dieser User? [Wichtig für Rechteverwaltung!]',
            fastSave: true
        },
    ];
    params.table = "account";
    params.id = id;
    return params;
}

/**
 * Prüfung der Daten vor dem Speichern
 * @param params
 * @returns {Promise<unknown>}
 */
async function checkSaveData(params) {
    return new Promise(async (resolve, reject) => {
        try {
            //#region Check Account Name
            if (params && params.body && params.body["name"] && params.body["name"] !== '') {
                await Account.database.getByName(params.body["name"])
                    .then(data => {
                        if (data && data.length > 0 && parseInt(data[0].id) !== parseInt(params.id)) {
                            params.errors.push({field: "name", text: "Name bereits vorhanden"});
                        }
                    })
                    .catch(err => {
                        app.logError(err, Account.moduleName + ":web.checkSaveData");
                        params.errors.push({field: "name", text: "Interner Fehler bei der Abfrage!"});
                    })
            } else {
                params.errors.push({field: "name", text: "Name darf nicht leer sein!"});
            }
            //#endregion Check Account Name

            //#region Check Rolle
            if (params && params.body && params.body["roles"] && params.body["roles"] !== '') {
                await Role.database.getByKey(params.body["roles"])
                    .then(data => {
                        if (!data || data.length === 0) {
                            params.errors.push({field: "roles", text: "Rolle nicht gefunden!"});
                        }
                    })
                    .catch(err => {
                        app.logError(err, Account.moduleName + ":web.checkSaveData");
                        params.errors.push({field: "roles", text: "Interner Fehler bei der Abfrage!"});
                    });
            } else {
                params.errors.push({field: "roles", text: "Rolle darf nicht leer sein!"});
            }
            //#endregion Check Rolle
            return resolve(params);
        } catch (err) {
            return reject(err);
        }
    })
}