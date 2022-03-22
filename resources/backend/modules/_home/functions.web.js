import {app} from "../../system/class.app.js";

/**
 * Starte Ausgabe - Hauptseite - Backend
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function toHome_backend(req, res) {
    app.web.toOutput(req, res, ["modules", "_home"], "backend", [], true);
}

/**
 * Starte Ausgabe - Hauptseite - Frontend
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 */
export function toHome_frontend(req, res) {
    app.web.toOutput(req, res, ["modules", "_home"], "frontend", [], false);
}