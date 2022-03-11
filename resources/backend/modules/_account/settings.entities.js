import orm from 'typeorm';

export const DBAccount = new orm.EntitySchema({
    name: 'account',
    columns: {
        id: { type: 'int', primary: true, generated: true },    // Interne ID - Fortlaufend
        name: { type: 'varchar', length: 50 },                  // Benutzername
        password: { type: 'varchar', length: 100 },             // Kennwort
        active: { type: 'tinyint', default: 0 },                // Account Aktiv
        isBackend: { type: 'tinyint', default: 0 },             // Backend Anmeldung möglich
        isFrontend: { type: 'tinyint', default: 0 },            // Frontend Anmeldung möglich
        mustChange: { type: 'tinyint', default: 0 },            // Kennwort resettet
        email: { type: 'varchar', length: 50, default: 0 },     // Email für AccountReset
        roles: { type: 'varchar', length: 255, default: 0 },    // Rollen
    }
})