//#region Functions - Web
import {app} from "../../system/class.app.js";

export function webToLogin(req, res) {
    app.web.toTwigOutput(req, res, ["modules", "_account"], "login", {}, true);
}

export function toAccountList(req, res) {
}

export function toAccountSingle(req, res) {
}
//#endregion Functions - Web
