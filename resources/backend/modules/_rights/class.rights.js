import * as fDatabase from './functions.database.js';

export default class Rights {
    static moduleName = 'Rights';

    constructor() {
    }

    static database = {
        getAll: fDatabase.databaseGetAll,
        getByID: fDatabase.databaseGetById,
        getByName: fDatabase.databaseGetByName,
        save: fDatabase.databaseSave
    };

}




