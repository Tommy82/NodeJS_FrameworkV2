import {app} from "../../system/class.app.js";
import { default as Account } from './class.account.js';

/**
 * Starte Ausgabe - Login vom Backend
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function webToLogin(req, res) {
    // Ausgabe des Login - Templates
    app.web.toTwigOutput(req, res, ["modules", "_account"], "login", {}, true);
}

/**
 * Prüft die Logindaten auf Richtigkeit
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export async function checkLogin(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if ( username && password ) {
        let loggedIn = false;

        let currData = await Account.database.getByName(username).catch(err => { throw err; });
        if ( currData && currData.length > 0 ) {
            if (await app.helper.security.comparePassword(password, currData[0].password).catch(err => { app.logError(err); })) {
                loggedIn = true;
            }
        }
        if ( loggedIn ) {
            req.session.loggedIn_Backend = true;
            req.session.user = {
                id: currData[0].id,
                username: username,
                role: currData[0].role,

            }

            let redirect = req.query.redirect;
            if ( redirect && redirect.trim() !== '') {
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
}

/**
 * Logout und Rückleitung zum Login Screen des Backends
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function toLogout(req, res) {
    req.session.loggedIn_Frontend = null;
    req.session.loggedIn_Backend = null;
    res.redirect("/backend/login");
}

/**
 * Starte Ausgabe - Listenansicht der Accounts
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function toAccountList(req, res) {
    //#region Set Parameters
    let params = app.frontend.parameters;
    params.header = ["ID", "Name", "Aktiv", "Backend", "Frontend", "Rollen", "Menü"];
    params.sql = "SELECT `id`, `name`, `active`, `isBackend`, `isFrontend`, `roles` FROM `account` ";
    params.where = "id > 0";
    params.menu = "";
    if ( app.helper.check.rights(Account.moduleName, "edit")) {
        params.menu = `<a class="toOverlay" href='/backend/account/%id%'><img src="/base/images/icons/edit.png" alt="" class="icon" href='/backend/account/%id%'></a>`;
    }
    params.colCheckbox = [2,3,4];
    params.addAdd = true;
    params.url_save = "/backend/account/0";
    //#endregion Set Parameters

    // Frontend Javascript
    let tableID = 'tblRoles';
    let js = `setDataTable('${tableID}');`;
    let title = "Benutzerverwaltung";

    app.frontend.table.generateByDB(tableID, params, null)
        .then(table => {
            app.web.toTwigOutput(req, res, ["base"], "backend_tableDefault", { TAB1: table, JS: js, title: title}, true);
        })
        .catch(err => { console.error(err); });
}

/**
 * Starte Ausgave - Detailansicht der Accounts
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function toAccountSingle(req, res, params = [], canClose = false) {

    params = setEditableData(req.params.id, params);
    let autoComplete = [ { fieldID: 'roles', filter: 'role'} ];

    app.frontend.table.generateEditByID(params, null)
        .then(data => { app.web.toTwigOutput(req, res, ["base"], "backend_tableEditDefault", { TAB_EDIT: data, AUTOCOMPLETE: autoComplete }, true); })
        .catch(err => { console.error(err); })
}

/**
 * Speichern - Speichern der Accountdaten
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function saveAccountSingle(req, res) {
    let params = setEditableData(req.params.id);

    params.body = req.body;

    app.frontend.table.saveEditByID(params, null)
        .then(data => {
            params.savedData = data;
            //toAccountSingle(req, res, params, true);
            res.send({ success: "success", data: [] });
        })
        .catch(err => { console.error(err); })
}

/**
 * Prüfung / Erstellung - Parameter
 * - für die Erstellung der Tabelle
 * - für Speicherung der Daten
 * @param {int} id Interne ID der Accounts (db:account.id)
 * @returns {*[]}
 */
function setEditableData(id, params = app.frontend.parameters) {
    params.columns = [
        { key: "name", type: "text", name: "Loginname", check: "notempty", fastSave: true },
        { key: "active", type: "checkbox", name: "Aktiv", check: "", fastSave: true },
        { key: "isBackend", type: "checkbox", name: "Login - Backend", description: 'Darf sich der User im Backend anmelden?', check: "", fastSave: true },
        { key: "isFrontend", type: "checkbox", name: "Login - Frontend", check: "", fastSave: true},
        { key: "roles", type: "text", name: "Rollen", check: "notempty", fastSave: true },
    ];
    params.table = "account";
    params.id = id;
    return params;
}