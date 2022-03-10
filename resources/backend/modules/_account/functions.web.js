//#region Functions - Web
import {app} from "../../system/class.app.js";

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
export function checkLogin(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if ( username && password ) {
        //ToDo: Check Login Data
        let loggedIn = true;
        if ( loggedIn ) {
            req.session.loggedIn_Backend = true;
            req.session.username = username;
            res.redirect("/backend");
        } else {
            res.send("Falsche Zugangsdaten");
        }
        res.end();
    } else {
        res.send("Fehlende Benutzerdaten");
        res.end();
    }
}

export function toAccountList(req, res) {
    app.web.toTwigOutput(req, res, ["modules", "_account"], "list", {}, true);
}

export function toAccountSingle(req, res) {
    // ToDo: Add Dynamic Overlay
    app.web.toTwigOutput(req, res, ["modules", "_account"], "details", {}, true);
}
//#endregion Functions - Web
