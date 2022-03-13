import { app } from '../../system/class.app.js';

export function toList(req, res) {
    let params = [];
    params["header"] = [];
    params["sql"] = "SELECT `id`, `moduleName`, `key`, `desc`, `defaultRole` from `rights` ";
    params["where"] = "where id > 0";
    params["menu"] = "";
    params["colCheckBox"] = [];
    params["addAdd"] = false;

    app.frontend.table.generateByDB('tblRights', params, null)
        .then(table => {
            app.web.toTwigOutput(req, res, ["base"], "backend_tableDefault", { TAB1: table}, true);
        })
        .catch(err => { console.error(err); })
}
