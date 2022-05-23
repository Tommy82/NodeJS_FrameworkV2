/**
 * Installation des Moduls [Role]
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

import {DBRoles, DBRolesRights} from "./settings.entities.js";
import {app} from "../../system/class.app.js";
import Role from "./class.role.js";
import { Functions as fRightsCheck } from './functions.rights.check.js'

class RoleInstall {

    /** Instanziiert eine neue Install Klasse **/
    constructor() { }

    /** Name des Moduls */
    moduleName = Role.moduleName;

    /** Datenbank Tabellen + Spalten **/
    entities = [  DBRoles, DBRolesRights ];

    /** Verwendete Rechte in diesem Modul */
    rights = [
        { key: "show", desc: "", defaultRole: "admin" },    // Anzeige der Rollen
        { key: "add", desc: "", defaultRole: "admin" },     // Neue Rolle anlegen
        { key: "change", desc: "", defaultRole: "admin" },  // Rolle ändern
        { key: "delete", desc: "", defaultRole: "admin" },  // Rolle löschen
    ];

    /** Was soll vor der Installation ausgeführt werden? */
    async init() {
        // Zuordnung des Hauptmoduls zur globalen Klasse
        app.modules.role = Role;
    }

    /** Was soll während der Installation ausgeführt werden? */
    async install() {
        // Synchronisation aller Rollen (Wichtig! vor Abgleich!)
        await Role.sync.all();
        // Installation der Basisrollen
        installBasicRoles();
    }

    /** Was soll bei jedem Serverstart ausgeführt werden? */
    async start() {

        addAutocompleteFilters();

        addRolesToGlobal().catch(err => { app.logError(err, Role.moduleName + ":install:start:addRolesToGlobal"); });

        addHelper();
    }
}

/**
 * Installation der Basisrollen
 */
function installBasicRoles() {
    // Basisrollen, welche installiert / überschrieben werden sollen
    let basicRoles = [
        { key: "admin", name: "Administrator", desc: "" },
    ]

    // Installation der einzelnen Rollen
    app.helper.lists.asyncForEach(basicRoles, async (role) => {
        let found = app.roles.find(x => x.key === role.key);
        if ( !found ) {
            let document = {
                id: 0,
                key: role.key,
                desc: role.desc,
                name: role.name
            };
            await Role.database.save(document).catch(err => { app.logError(err, Role.moduleName); })
        }
    })
}

/**
 * Frontend Autocomplete Filter für dieses Modul
 */
function addAutocompleteFilters() {
    app.frontend.autocomplete.push({ filter: "role", callback: Role.database.AutoCompleteRole });
}

/**
 * Synchronise alle Rollen mit globaler Klasse
 * @returns {Promise<void>}
 */
async function addRolesToGlobal() {
    app.roles = await Role.database.getAll()
        .catch(err => { console.error(err); });

    if ( app.roles && app.roles.length > 0 ) {
        for ( let i = 0; i < app.roles.length; i++ ) {
            app.roles[i].rights = await Role.rights.getAllFromRole(app.roles[i].id).catch(err => { console.error(err); })
        }
    }
}

/**
 * Hinzufügen von Hilfsfunktionen
 */
function addHelper() {
    app.helper.check.rights = {
        bySession: fRightsCheck.bySession,
        byRole: fRightsCheck.byRole,
    }
}

// Hinzufügen der Installationsklasse
app.addInstallModule(new RoleInstall());


