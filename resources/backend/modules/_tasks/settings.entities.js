import orm from 'typeorm';

export const DBTasks = new orm.EntitySchema({
    name: 'tasks',
    columns: {
        id: { type: 'int', primary: true, generated: true },
        module: { type: 'varchar', length: 50 },
        key: { type: 'varchar', length: 50 },
        description: { type: 'varchar', length: 255, default: '' },
        active: { type: 'tinyint' },
        interval: { type: 'int' },
    }
})