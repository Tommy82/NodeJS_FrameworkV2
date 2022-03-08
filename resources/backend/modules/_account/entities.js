import orm from 'typeorm';

export const DBAccount = new orm.EntitySchema({
    name: 'account',
    columns: {
        id: { type: 'int', primary: true, generated: true },
        name: { type: 'varchar', length: 50 },
        password: { type: 'varchar', length: 100 },
        active: { type: 'tinyint', default: 0 }
    }
})