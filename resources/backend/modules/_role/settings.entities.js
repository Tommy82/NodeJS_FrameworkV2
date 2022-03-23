/**
 * Datenbank (Tabellen + Spalten) des Moduls [Role]
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

import orm from 'typeorm';

// Rollen
export const DBRoles = new orm.EntitySchema({
    name: 'roles',
    columns: {
        id: { type: 'int', primary: true, generated: true },    // Interne ID
        key: { type: 'varchar', length: 50 },                   // einzigartiger Schlüssel der Rolle
        name: { type: 'varchar', length: 50 },                  // Name der Rolle
        desc: { type: 'varchar', length: 255 },                 // Beschreibung der Rolle
    }
});

// Zuordnung der Rollen und Rechte
export const DBRolesRights = new orm.EntitySchema({
    name: "rolesRights",
    columns: {
        id: { type: 'int', primary: true, generated: true },    // Interne ID
        roleID: { type: 'int' },                                // ID der Rolle (db:roles.id)
        rightID: { type: 'int' },                               // ID des Rechts (db:rights.id)
        allowed: { type: 'tinyint', default: 0 },               // Erlaubt (0=nein, 1=ja)
    }
})