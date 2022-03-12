import {app} from "../../system/class.app.js";

export function toHome_backend(req, res) {
    app.web.toTwigOutput(req, res, ["modules", "_home"], "backend", [], true);
}

export function toHome_frontend(req, res) {
    app.web.toTwigOutput(req, res, ["modules", "_home"], "frontend", [], false);
}