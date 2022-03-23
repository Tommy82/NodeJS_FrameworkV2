/**
 * Hauptklasse des Moduls [Account]
 *
 * @module:     Account
 * @version:    1.0
 * @revision:   1
 * @author:     Thomas Göttsching
 * @company:    Thomas Göttsching
 *
 * Wichtiger Hinweis: Änderungen an dieser Datei können die Updatefähigkeit beeinträchtigen.
 * Daher wird dringend davon abgeraten!
 */

import { Functions as fWeb } from './functions.web.js';
import { Functions as fDatabase } from './functions.database.js';

/** Modul - Account */
export default class Account {
    static moduleName = 'Account';

    /** Instanziiert eine neue AccountKlasse */
    constructor() { }

    /** Webkomponente dieses Moduls */
    static web = fWeb;

    /** Datenbank Komponente dieses Moduls */
    static database = fDatabase;

}


