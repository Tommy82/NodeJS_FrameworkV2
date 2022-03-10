//#region Functions - Web
import {app} from "../../system/class.app.js";

export function webToLogin(req, res) {
    app.web.toTwigOutput(req, res, ["modules", "_account"], "login", {}, true);
}

export function toAccountList(req, res) {
    // ToDo: Add Dynamic Table
    app.web.toTwigOutput(req, res, ["modules", "_account"], "list", {}, true);
}

export function toAccountSingle(req, res) {
    // ToDo: Add Dynamic Overlay
    app.web.toTwigOutput(req, res, ["modules", "_account"], "details", {}, true);
}
//#endregion Functions - Web
