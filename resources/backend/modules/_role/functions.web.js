//#region Functions - Web
import {app} from "../../system/class.app.js";
import { default as Role } from './class.role.js';


export async function getList(req, res) {
    let params = [];
    params["header"] = ["ID", "Key", "Name", "Beschreibung", "Menü"];
    params["sql"] = "SELECT `id`, `key`, `name`, `desc` FROM `roles` ";
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


export async function getDetails(req, res, postParams = [], canClose = false) {

    let id = req.params.id;
    let params = setEditableData(req.params.id, postParams);

    //Role.database.rightsGetAll(id)
    Role.rights.getAllFromRole(id)
        .then(lstRights => {
            app.frontend.table.generateEditByID(params, null)
                .then(data => {
                    app.web.toTwigOutput(req, res, ["base"], "backend_tableEditDefault", { TAB_EDIT: data, TAB_RIGHTS: lstRights, AUTOCOMPLETE: [], canClose: canClose }, true);
                })
                .catch(err => { console.error(err); })
        })
        .catch(err => { return reject(err); })
}

export async function setDetails(req, res) {
    //TODO: Save Data

    let postParams = [];

    postParams = req.body;

    getDetails(req, res, postParams,true).catch(err => { console.log(err); })
}

export async function AutoComplete(search) {
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

/**
 * Prüfung / Erstellung - Parameter
 * - für die Erstellung der Tabelle
 * - für Speicherung der Daten
 * @param {int} id Interne ID der Accounts (db:account.id)
 * @returns {*[]}
 */
function setEditableData(id, postParams = []) {
    let params = [];
    params["columns"] = [
        { key: "name", type: "text", name: "Name", check: "notempty", postData: null },
        { key: "desc", type: "text", name: "Beschreibung", check: "", postData: null },
    ];
    params["table"] = "roles";
    params["id"] = id;
    return params;
}