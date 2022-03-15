//#region Functions - Web
import {app} from "../../system/class.app.js";
import { default as Role } from './class.role.js';


export async function webGetList(req, res) {
    let params = [];
    params["header"] = ["ID", "Modul", "Schlüssel", "Beschreibung", "StandardRolle", "Menü"];
    params["sql"] = "SELECT `id`, `moduleName`, `key`, `desc`, `defaultRole` FROM `rights`";
    params["where"] = "id > 0";
    if ( app.helper.check.rights(Role.moduleName, "edit")) {
        params["menu"] = `<a class="toOverlay" href='/backend/role/%id%'><img src="/base/images/icons/edit.png" alt="" class="icon" href='/backend/role/%id%'></a>`;
    }

    let autocomplete = [{fieldID: "role", filter: "role"}];

    app.frontend.table.generateByDB('tblRoles', params, null)
        .then(table => {
            let js = "setDataTable('tblRoles');";
            app.web.toTwigOutput(req, res, ["modules", "_role"], "list", { TAB1: table, JS: js, AUTOCOMPLETE: autocomplete }, true);
        })
        .catch(err => { console.error(err); });
}

export async function webGetDetails(req, res) {

    let id = req.params.id;

    Role.database.rightsGetAll(id)
        .then(data => {
            app.web.toTwigOutput(req, res, ["modules", "_role"], "details", {}, true);
        })
        .catch(err => { return reject(err); })
}


export async function webAutoComplete(search) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT `id`, `name`, `key` FROM `roles` ";
        if ( search ) {
            sql += ` WHERE \`name\` like '%${search.trim()}%' `;
            if ( app.helper.check.isNumeric(search)) {
                sql += ` OR \`id\` = ${parseInt(search)} `;
            }
        }
        sql += " limit 0, 5";
        app.DB.query(sql)
            .then(data => {
                let response = [];
                if ( data && data.length > 0 ) {
                    data.forEach(item => {
                        // response.push(`${item.id} | ${item.name}`); // TODO: Update Value, ggfl. Override nach senden
                        response.push(`${item.key}`);
                    })
                }
                return resolve(response);
            })
            .catch(err => { return reject(err); })
    })
}
//#endregion Functions - Web