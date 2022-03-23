/**
 * Installationsklasse des Moduls [Account]
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

import {app} from "../../system/class.app.js";
import {DBAccount} from "./settings.entities.js";
import Account from "./class.account.js";
import { Administrator } from "../../../config/settings.js";

class AccountInstall {
    /** Instanziiert eine neue Install Klasse **/
    constructor() { }

    /** Name des Moduls */
    moduleName = Account.moduleName;

    /** Datenbank Tabellen + Spalten **/
    entities = [  DBAccount ];

    /** Verwendete Rechte in diesem Modul */
    rights = [
        { key: "add", desc: "", defaultRole: "admin" },     // Neuen Account hinzufügen
        { key: "change", desc: "", defaultRole: "admin" },  // Vorhandenen Account ändern
        { key: "delete", desc: "", defaultRole: "admin" },  // Vorhandenen Account löschen
    ];

    /** Was soll vor der Installation ausgeführt werden? */
    async init() {
        app.modules.account = Account;
    }

    /** Was soll während der Installation ausgeführt werden? */
    async install() {
    }

    /** Was soll bei jedem Serverstart ausgeführt werden? */
    async start() {
        this.installAdminAccount();
    }

    /**
     * Installation des Admin-Accounts aus der Config
     * - überschreiben der Datenbankeinträge, falls geändert
     */
    installAdminAccount() {
        if ( Administrator.username && Administrator.username !== "" && Administrator.password && Administrator.password !== "") {
            Account.database.getByName(Administrator.username)
                .then(async data => {
                    let document = {
                        id: data && data.length > 0 ? data[0].id : 0,
                        name: Administrator.username,
                        password: await app.helper.security.hashPassword(Administrator.password),
                        active: 1,
                        isBackend: 1,
                        isFrontend: 1,
                        mustChange: 0,
                        email: '',
                        roles: 'admin'
                    };
                    Account.database.save(document)
                        .then(() => { app.log("Administrator Account Updated", Account.moduleName); })
                        .catch(err => { app.logError(err, Account.moduleName); })
                })
                .catch(err => { app.logError(err, Account.moduleName); })
        }
    }
}

// Hinzufügen der Installationsklasse zum Hauptmodul
app.addInstallModule(new AccountInstall());