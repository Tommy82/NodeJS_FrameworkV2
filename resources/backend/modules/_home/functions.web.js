import {app} from "../../system/class.app.js";

export function toHome(req, res) {
    app.web.toTwigOutput(req, res, ["modules", "_home"], "home", [], true);
}