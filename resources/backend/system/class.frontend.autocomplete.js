import {app} from "./class.app.js";

export function afterStart() {
    app.web.addRoute("get", "/backend/autocomplete/:filter/:search", fAutocomplete, false, false);
}

export async function fAutocomplete(req, res) {
    let filter = req.params.filter;
    let search = req.params.search;
    let response = [];
    if ( filter !== null && filter !== '' ) {
        let found = app.frontend.autocomplete.find(x => x.filter === filter);
        if ( found ) {
            response = await found.callback(search);
        }
    }
    return res.json(response);
}
