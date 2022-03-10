import orm from 'typeorm';

export const DBRoles = new orm.EntitySchema({
    name: 'roles',
    columns: {
        id: { type: 'int', primary: true, generated: true },
        key: { type: 'varchar', length: 50 },
        name: { type: 'varchar', length: 50 },
        desc: { type: 'varchar', length: 255 },
    }
});
