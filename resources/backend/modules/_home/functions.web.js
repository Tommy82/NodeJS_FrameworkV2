import {app} from "../../system/class.app.js";

/**
 * Starte Ausgabe - Hauptseite - Backend
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function toHome_backend(req, res) {
    let params = new app.frontend.parameters();
    app.web.toOutput(req, res, ["modules", "_home"], "backend", params.output, true);
}

/**
 * Starte Ausgabe - Hauptseite - Frontend
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function toHome_frontend(req, res) {
    let params = new app.frontend.parameters();
    app.web.toOutput(req, res, ["modules", "_home"], "frontend", params.output, false);
}