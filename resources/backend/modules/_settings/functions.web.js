import {app} from '../../system/class.app.js';
import { default as Settings } from './class.settings.js';

export class Functions {
    static ToList = ToList;
    static ToDetails = ToDetails;
    static FromDetails = FromDetails;
}

/**
 * Starte Ausgabe - Liste der Einstellungen
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 * @returns {Promise<void>}
 * @constructor
 */
async function ToList(req, res) {
    try {
        //#region Erstellen der Parameter
        let params = new app.frontend.parameters();

        params.header = ["ID", "Modul", "Schlüssel", "Wert", "Typ", "Menu"];
        params.sql = "SELECT `id`, `module`, `key`, `value`, `type` FROM `settings` ";
        params.where = " id > 0 ";
        params.menu = "";

        if ( app.helper.check.rights.bySession(req, Settings.moduleName, "change")) {
            params.menu += `<a class="toOverlay" href='${app.web.prefix}/backend/settings/%id%?overlay=1'><img src="${app.web.prefix}/base/images/icons/edit.png" alt="" class="icon"></a>`;
        }
        //#endregion Erstellen der Parameter

        // Generierung der Tabelle
        app.frontend.table.generateByDB('tblSettings', 'TAB1', params, null)
            .then(response => {
                // Starte Ausgabe
                app.web.toOutput(req, res, ["base"], "backend_tableDefault", response.params.output, true);
            })
            .catch(err => {
                // Wenn ein Fehler auftritt, gehe zu Fehlerseite
                app.logError(err, "SYSTEM:settings:ToList");
                app.web.toErrorPage(req, res, err, true, true, false);
            })
    } catch ( err ) {
        // Wenn ein Fehler auftritt, gehe zu Fehlerseite
        app.logError(err, "System:Settings");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

/**
 * Starte Ausgabe - Detailansicht
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 * @returns {Promise<void>}
 * @constructor
 */
async function ToDetails(req, res) {
    let params = SetEditableData(req);

    let autocomplete = [];

    app.frontend.table.generateEditByID(params, null)
        .then(response => {
            let data = response.data;
            params = response.params;
            app.web.toOutput(req, res, ["base"], "backend_tableEditDefault", {
                TAB_EDIT: data,
                AUTOCOMPLETE: autocomplete
            }, true)
        })
        .catch(err => {
            app.logError(err, Settings.moduleName + ":web:ToDetails");
            app.web.toErrorPage(req, res, err, true, true, false);
        })
}

/**
 * Speichern der Eigenschaften
 * @param {*} req Webserver - Request
 * @param {*} res Webserver - Response
 * @returns {Promise<void>}
 * @constructor
 */
async function FromDetails(req, res) {
    try {
        let params = SetEditableData(req);
        if ( !params || params.errors.length > 0 ) {
            res.send({ success: 'error', data: params.errors});
        } else {
            app.frontend.table.saveEditByID(params, null)
                .then(response => {
                    res.send({ success: "success", data: [] });
                })
                .catch(err => {
                    app.logError(err, Settings.moduleName + ":web:FromDetails");
                    app.web.toErrorPage(req, res, err, true, true, false);
                })
        }
    }
    catch(err ) {
        app.logError(err, Settings.moduleName + ":web:FromDetails");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

/**
 * Editable Data für die Speicherung und Einzeldetails
 * @param {*} req Webserver - Request
 * @constructor
 */
function SetEditableData(req) {
    let params = new app.frontend.parameters();
    params.columns = [
        { key: 'module', name: 'Modul', type: 'text', editable: false },
        { key: 'key', name: 'Name', type: 'text', editable: false },
        { key: 'value', name: 'Wert', type: 'text', editable: true }
    ];
    params.table = "settings";
    params.id = req.params.id;
    params.body = req.body;
    return params;
}

/**
 * Prüfung der Eingaben
 * @param params
 * @returns {*}
 * @constructor
 */
function CheckSaveData(params) {
    // ToDo: Vervollständigen
    return params;
}