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
            req.session.username = username;

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

export function toLogout(req, res) {
    req.session.loggedIn_Frontend = null;
    req.session.loggedIn_Backend = null;
    res.redirect("/backend/login");
}

export function toAccountList(req, res) {
    let params = [];
    params["header"] = ["ID", "Name", "Aktiv", "Backend", "Frontend", "Rollen", "Menü"];
    params["sql"] = "SELECT `id`, `name`, `active`, `isBackend`, `isFrontend`, `roles` FROM `account` ";
    params["where"] = "id > 0";
    params["menu"] = `<a class="toOverlay" href='/backend/account/%id%'><img src="/base/images/icons/edit.png" alt="" class="icon" href='/backend/account/%id%'></a>`;
    params["colCheckbox"] = [2,3,4];

    let js = "setDataTable('tblRoles');";

    app.frontend.table.generateByDB('tblRoles', params, null)
        .then(table => {
            app.web.toTwigOutput(req, res, ["base"], "backend_tableDefault", { TAB1: table, JS: js}, true);
        })
        .catch(err => { console.error(err); });
}

export function toAccountSingle(req, res) {

    let params = setEditableData(req.params.id);

    app.frontend.table.generateEditByID(params, null)
        .then(data => { app.web.toTwigOutput(req, res, ["base"], "backend_tableEditDefault", { TAB_EDIT: data }, true); })
        .catch(err => { console.error(err); })
}

export function saveAccountSingle(req, res) {
    let params = setEditableData(req.params.id);

    params["body"] = req.body;

    app.frontend.table.saveEditByID(params, null)
        .then(data => { res.json({ success: true, data: data }); })
        .catch(err => { res.json({ success: false }); })
}

function setEditableData(id) {
    let params = [];
    params["columns"] = [
        { key: "name", type: "text", name: "Loginname", check: "notempty" },
        { key: "active", type: "checkbox", name: "Aktiv", check: "" },
        { key: "isBackend", type: "checkbox", name: "Login - Backend", check: ""},
        { key: "isFrontend", type: "checkbox", name: "Login - Frontend", check: ""},
        { key: "roles", type: "text", name: "Rollen", check: "notempty" },
        { key: 'test1', type: "text", name: "Mein Test", check: "", notInTable: true, value: "hallo1"}
    ];
    params["table"] = "account";
    params["id"] = id;
    return params;
}