import orm from 'typeorm';

export const DBRights = new orm.EntitySchema({
    name: 'rights',
    columns: {
        id: { type: 'int', primary: true, generated: true },
        moduleName: { type: 'varchar', length: 50 },
        key: { type: 'varchar', length: 100 },
        desc: { type: 'varchar', length: 255, default: '' },
        defaultRole: { type: 'varchar', length: 50, default: '' }
    }
});

export const DBRights_Role = new orm.EntitySchema({
    name: 'rights_role',
    columns: {
        id: {type: 'int', primary: true, generated: true},
        rightID: {type: 'int'},
        roleID: {type: 'int'},
    }
})