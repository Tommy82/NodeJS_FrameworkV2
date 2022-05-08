import {app} from '../../system/class.app.js';
import { default as Settings } from './class.settings.js';

export class Functions {
    static ToList = ToList;
    static ToDetails = ToDetails;
    static FromDetails = FromDetails;
}

/**
 * Starte Ausgabe - Liste der Einstellungen
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @constructor
 */
async function ToList(req, res) {
    try {
        let params = new app.frontend.parameters();

        params.header = ["ID", "Modul", "Schlüssel", "Wert", "Typ", "Menu"];
        params.sql = "SELECT `id`, `module`, `key`, `value`, `type` FROM `settings` ";
        params.where = " id > 0 ";
        params.menu = "";

        if ( app.helper.check.rights.bySession(req, Settings.moduleName, "change")) {
            params.menu += `<a class="toOverlay" href='${app.web.prefix}/backend/settings/%id%?overlay=1'><img src="${app.web.prefix}/base/images/icons/edit.png" alt="" class="icon"></a>`;
        }

        app.frontend.table.generateByDB('tblSettings', 'TAB1', params, null)
            .then(response => {
                app.web.toOutput(req, res, ["base"], "backend_tableDefault", response.params.output, true);
            })
            .catch(err => {
                app.logError(err, "SYSTEM:settings:ToList");
                app.web.toErrorPage(req, res, err, true, true, false);
            })
    } catch ( err ) {
        app.logError(err, "System:Settings");
        app.web.toErrorPage(req, res, err, true, true, false);
    }
}

async function ToDetails(req, res) {
    let params = new app.frontend.parameters();
    //#region Set editable Data
    params.columns = [
        { key: 'module', name: 'Modul', type: 'text', editable: false },
        { key: 'key', name: 'Name', type: 'text', editable: false },
        { key: 'value', name: 'Wert', type: 'text', editable: true }
    ];
    params.table = "settings";
    params.id = req.params.id;
    //#endregion Set editable Data

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

async function FromDetails(req, res) {
    res.send("ok");
}