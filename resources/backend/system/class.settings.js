import { app } from "./class.app.js";

export class Functions {
    static GetByID = GetByID;
    static GetByModule = GetByModule;
    static GetByKey = GetByKey;
    static Upsert = Upsert;
}

/**
 * Laden einer bestimmten Einstellung anhand der Internen ID
 * @param {int} id Interne ID (db:settings.id)
 * @returns {Promise<any|null>}
 * @constructor
 */
async function GetByID(id) {
    return new Promise((resolve, reject) => {
        app.DB.findById("settings", id)
            .then(response => { return resolve(response); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Laden aller Einstellungen eines Moduls
 * @param {string} moduleName Name des Moduls (db:settings.module)
 * @returns {Promise<any|null>}
 * @constructor
 */
async function GetByModule(moduleName) {
    let document = { module: moduleName };
    return FindByDocument(document);
}

/**
 * Laden einer bestimmten Einstellung für ein bestimmtes Modul
 * @param {string} moduleName Name des Moduls (db:settings.module) | Wichtig da mehrere Module denselben Key haben könnten
 * @param {string} key Eindeutiger Name der Einstellung
 * @returns {Promise<any|null>}
 * @constructor
 */
async function GetByKey(moduleName, key) {
    let document = { module: moduleName, key: key };
    return FindByDocument(document);
}

/**
 * Laden der Einstellung(en) anhand der angegebenen Daten
 * @param {any} document Daten wonach "gefiltert" werden soll (db:settings)
 * @returns {Promise<any>}
 * @constructor
 */
async function GetByDocument(document) {
    return new Promise((resolve, reject) => {
        app.DB.find("settings", document)
            .then(response => { return resolve(response); })
            .catch(err => { return reject(err); })
    })
}

/**
 * Eintragung oder Update einer Einstellung
 * - Mindestens folgende Parameter MÜSSEN angegeben werden:
 * -> id (Einstellung mit "id" wird geändert)
 * -> moduleName UND key (Einstellung mit Name des Moduls und Eindeutigem Namen wird geändert)
 * @param {int|null} id Interne ID (db:settings.id)
 * @param {string} value Wert der Einstellung (db:settings.value)
 * @param {string|null} moduleName Name des Moduls (db:settings.module)
 * @param {string|null} key Eindeutiger Name der Einstellung (db:settings.key)
 * @param {string|null} type Datentyp der Einstellung
 * @returns {Promise<any|null>}
 * @constructor
 */
async function Upsert(id, value, module = null, key = null, type = null) {
    return new Promise(async (resolve, reject) => {
        let document = {};
        document.value = value;

        if ( (!id || id === 0) && ( !module || !key)) {
            return reject("Unzureichende Daten");
        }

        if ( id && id > 0 ) { document.id = id; }
        else {
            let documentFind = await GetByDocument({ module: module, key: key}).catch(err => { return reject(err); })
            if ( documentFind && documentFind.length > 0 &&  documentFind[0].id > 0 ) {
                id = documentFind[0].id;
            }
        }
        if ( module && module.trim() != '' ) { document.module = module; }
        if ( key && key.trim() != '' ) { document.key = key; }
        if ( type && type.trim() != '' ) { document.type = type; }

        app.DB.upsert("settings", document)
            .then(response => { return resolve(response); })
            .catch(err => { return reject(err); })
    })
}

