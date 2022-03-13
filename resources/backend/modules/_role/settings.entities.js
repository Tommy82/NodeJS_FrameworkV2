import orm from 'typeorm';

// Rollen
export const DBRoles = new orm.EntitySchema({
    name: 'roles',
    columns: {
        id: { type: 'int', primary: true, generated: true },
        key: { type: 'varchar', length: 50 },
        name: { type: 'varchar', length: 50 },
        desc: { type: 'varchar', length: 255 },
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