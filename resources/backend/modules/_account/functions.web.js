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
import {Administrator} from "../../../config/settings.js";

/** Funktionsklasse zur verwaltung der export Funktionen in dieser Datei **/
export class Functions {
    static toLogin = toLogin;
    static checkLogin = checkLogin;
    static toLogout = toLogout;
    static toAccountList = toAccountList;
    static toAccountSingle = toAccountSingle;
    static saveAccountSingle = saveAccountSingle;
    static delAccountSingle = delAccountSingle;
    static toMe = toMe;
    static saveMe = saveMe;
    static toForgot = toForgot;
    static saveForgot = saveForgot;
}

/**
 * Starte Ausgabe - Login vom Backend
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
function toLogin(req, res) {
    try {

        let msg = req && req.query && req.query.msg ? req.query.msg : '';

        // Ausgabe des Login - Templates
        app.web.toOutput(req, res, ["modules", "_account"], "login", {msg : msg}, true);
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:webToLogin");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

const  generateRandomString = (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789![]_-?§$%&/()=';
    let result1= Math.random().toString(36).substring(0,num);

    return result1;
}

async function saveForgot(req, res) {
    let username = req.body.username;

    Account.database.getByName(username)
        .then(async data => {
            if ( data && data.length > 0 && data[0].email ) {
                if ( data[0].email != '' ) {
                    let newPassword = generateRandomString(12);

                    let document = {
                        id: data[0].id,
                        password: await app.helper.security.hashPassword(newPassword),
                    }

                    Account.database.save(document)
                        .then(() => {
                            let text = 'Ihr neues Kennwort lautet: ' + newPassword;
                            let html = null;
                            app.mail.sendMail(data[0].email, 'Ihr neues Kennwort', text, html);
                            res.redirect(app.web.prefix + '/backend/login?msg=pass_changed');
                        })
                        .catch(err => {
                            app.logError(err, Account.moduleName + ":web:webToLogin");
                            app.web.toErrorPage(req, res, err, true, true, false);
                        })
                }
                else {
                    app.log("Kennwort Reset gescheitert: Benutzer hat keine Mail [" + username + "]");
                    res.redirect(app.web.prefix + '/backend/login?msg=pass_changed');
                }
            } else {
                app.log("Kennwort Reset gescheitert: Benutzer nicht vorhanden oder hat keine Mail [" + username + "]");
                res.redirect(app.web.prefix + '/backend/login?msg=pass_changed');
            }
        })
        .catch(err => {
            app.logError(err, Account.moduleName + ":web:webToLogin");
            app.web.toErrorPage(req, res, err, true, true, false);
        })
}

function toForgot(req, res) {
    try {
        // Ausgabe des Login - Templates
        app.web.toOutput(req, res, ["modules", "_account"], "forgot", {}, true);
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:toForgot");
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
                    res.redirect(app.web.prefix + "/backend");
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
        res.redirect(app.web.prefix + "/backend/login");
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

        // Namen der Tabellenheader
        params.header = ["ID", "Name", "Aktiv", "Backend", "Frontend", "Rollen", "Menü"];
        // SQL Abfrage (ohne Where!)
        params.sql = "SELECT `id`, `name`, `active`, `isBackend`, `isFrontend`, `roles` FROM `account` ";
        // Where Klausel
        params.where = "id > 0";
        // Welche Spalten sollen als Checkboxen ausgegeben werden
        params.colCheckbox = [2, 3, 4];
        // Soll die FastSave Funktion hinzugefügt werden?
        params.addAdd = true;
        // Url für FastSave
        params.url_fastsave = app.settings.webServer.prefix + "/backend/account/0";

        // Menü
        params.menu = "";
        // Wenn Änderungen erlaubt, setze Button für Änderungen
        if (app.helper.check.rights.bySession(req, Account.moduleName, "change")) {
            params.menu += `<a class="toOverlay" href='${app.web.prefix}/backend/account/%id%?overlay=1'><img src="/base/images/icons/edit.png" alt="" class="icon"></a>`;
        }
        // Wenn Löschen erlaubt, setze Button für Löschen
        if (app.helper.check.rights.bySession(req, Account.moduleName, "delete")) {
            params.menu += `<a href="${app.web.prefix}/backend/account/%id%/del" value1="Benutzer" value2="%id%" value3="%name%" class="btnDelete""><span><img src="/base/images/icons/delete.png" alt="" class="icon"></a></span>`;
        }
        //#endregion Set Parameters

        // Generierung der Tabelle
        app.frontend.table.generateByDB("tblAccounts", "TAB1", params, null)
            .then(response => {
                // Ausgabe
                app.web.toOutput(req, res, ["base"], "backend_tableDefault", response.params.output, true);
            })
            .catch(err => {
                app.logError(err, Account.moduleName + ":web:toAccountList");
                app.web.toErrorPage(req, res, err, true, true, false);
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
            .then(response => {
                let data = response.data;
                params = response.params;
                app.web.toOutput(req, res, ["base"], "backend_tableEditDefault", {
                    TAB_EDIT: data,
                    AUTOCOMPLETE: autoComplete
                }, true);
            })
            .catch(err => {
                app.logError(err, Account.moduleName + ":web:toAccountSingle");
                app.web.toErrorPage(req, res, err, true, true, false);
            })
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:toAccountSingle");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

function toMe(req, res) {
    let id = req.params.id;

    if ( req && req.session && req.session.user && req.session.user.id && parseInt(id) === parseInt(req.session.user.id)) {
        Account.database.getByID(parseInt(id))
            .then(lstAccount => {
                let output = {
                    email: lstAccount && lstAccount.length > 0 ? lstAccount[0].email : ""
                }
                app.web.toOutput(req, res, ["modules", "_account"], "me", output, true);
            })
            .catch(err => {
                app.logError(err);
                app.web.toErrorPage(req, res, err, true, true, true);
            })
    } else {
        app.web.toErrorPage(req, res, new Error("Access denied"), true, true, false);
    }
}

async function saveMe(req, res) {
    let id = req.params.id;

    if ( req && req.session && req.session.user && req.session.user.id && parseInt(id) === parseInt(req.session.user.id)) {

        let email = req.body["email"];
        let password = req.body["password"];

        let document = {
            id: parseInt(id),
            email: email,
        }

        if ( password && password.trim() != '' ) {
            password = await app.helper.security.hashPassword(password);
            document.password = password;
        }

        Account.database.save(document)
            .then(() => {
                res.send({success: "success", data: [], redirect: app.web.prefix + '/backend'});
            })
            .catch(err => {
                res.send({success: "error", error: err.message });
            })


    } else {
        res.send({success: "error", error: "Access denied", redirect: app.web.prefix + '/backend'});
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

            if ( params.id === 0 || params.id === '0') {

                let password = app.settings.users.init_password;

                if ( password && password.trim() != '' ) {
                    password = await app.helper.security.hashPassword(password);
                    params.body["password"] = password;
                }

                params.columns.push({
                    key: "password",
                    type: "text",
                    name: "Kennwort",
                    check: "notempty",
                    fastSave: true,
                    inList: true,
                });
            }

            app.frontend.table.saveEditByID(params, null)
                .then(data => {
                    params.savedData = data;
                    //toAccountSingle(req, res, params, true);
                    res.send({success: "success", data: []});
                })
                .catch(err => {
                    app.logError(err, Account.moduleName + ":web:saveAccountSingle");
                    app.web.toErrorPage(req, res, err, true, true, false);
                })
        }
    } catch (err) {
        app.logError(err, Account.moduleName + ":web:saveAccountSingle");
        app.web.toErrorPage(req, res, err, true, true, false);
    }

}

/**
 * Löschen - Löschen eines Accounts
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 * @returns {Promise<void>}
 */
async function delAccountSingle(req, res) {
    let id = req.params.id;
    if ( id && id != "" && parseInt(id) > 0 ) {
        if (app.helper.check.rights.bySession(req, Account.moduleName, "delete")) {
            Account.check.canDelete(id)
                .then(canDelete => {
                    if ( canDelete ) {

                        Account.database.deleteById(id)
                            .then(() => { res.send({ success: "success", data: []}); })
                            .catch(err => {
                                app.logError(err);
                                res.send({ success: "error", error: "Fehler beim Löschen der Daten"});
                            })

                    } else {
                        res.send({ success: "error", error: "Benutzer kann nicht gelöscht werden da er verwendet wird!"});
                    }
                })
                .catch(err => {

                })
        } else {
            res.send({ success: "error", error: "Access denied" });
        }
    } else {
        res.send({ success: "error", error: "ID not found" });
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
        {
            key: "name",
            type: "text",
            name: "Benutzername",
            check: "notempty",
            fastSave: true,
            inList: true,
        },
        {
            key: "active",
            type: "checkbox",
            name: "Aktiv",
            check: "",
            fastSave: true,
            inList: true,
        },
        {
            key: "isBackend",
            type: "checkbox",
            name: "Login - Backend",
            description: 'Darf sich der User im Backend anmelden?',
            check: "",
            fastSave: true,
            inList: true,
        },
        {
            key: "isFrontend",
            type: "checkbox",
            name: "Login - Frontend",
            description: 'Darf sich der User im Frontend anmelden?',
            check: "",
            fastSave: true,
            inList: true,
        },
        {
            key: "roles",
            type: "text",
            name: "Rolle",
            check: "notempty",
            description: 'Welche Rolle hat dieser User? [Wichtig für Rechteverwaltung!]',
            fastSave: true,
            inList: true,
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