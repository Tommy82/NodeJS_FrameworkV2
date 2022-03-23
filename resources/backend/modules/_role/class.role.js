/**
 * Start des Moduls [Role]
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

import { Functions as fDatabase } from './functions.database.js';
import { Functions as fWeb } from './functions.web.js';
import { Functions as fRights } from './functions.rights.js';
import { Functions as fSync } from './functions.sync.js';

export default class Role {
    /** Name des Moduls **/
    static moduleName = 'Role';

    /** Instanziiert eine neue AccountKlasse */
    constructor() {}

    /** Webkomponente dieses Moduls */
    static web = fWeb;

    /** Datenbank Komponente dieses Moduls */
    static database = fDatabase;

    /** Rechteverwaltung für die Rollen **/
    static rights = fRights;

    /** Synchronisationseinstellungen für Rollen **/
    static sync = fSync;
}

