//#region Functions - Web
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
    params["menu"] = `<a href='/backend/account/%id%' class="fa-solid fa-pen-to-square"><label><i class="fa-solid fa-pen-to-square"></i></label></a>`;
    params["colCheckbox"] = [2,3,4];

    let js = "setDataTable('tblRoles');";

    app.frontend.table.generateByDB('tblRoles', params, null)
        .then(table => {
            app.web.toTwigOutput(req, res, ["base"], "backend_tableDefault", { TAB1: table, JS: js}, true);
        })
        .catch(err => { console.error(err); });
}

export function toAccountSingle(req, res) {
    // ToDo: Add Dynamic Overlay
    app.web.toTwigOutput(req, res, ["modules", "_account"], "details", {}, true);
}
//#endregion Functions - Web
