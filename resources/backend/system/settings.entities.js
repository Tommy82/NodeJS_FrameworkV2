import orm from 'typeorm';

export const DBSettings = new orm.EntitySchema({
    name: 'settings',
    columns: {
        id: { type: 'int', primary: true, generated: true },    // Interne ID - Fortlaufend
        module: { type: 'varchar', length: 50 },                // Name des Moduls
        key: { type: 'varchar', length: 50 },                   // Eindeutiger Name der Einstellung
        value: { type: 'varchar', length: 255 },                // Wert der Einstellung
        type: { type: 'varchar', length: 15 },                  // Datentyp der Einstellung
    }
})