import { app } from "../../system/class.app.js";
import {DBRoles} from "./settings.entities.js";
import * as fDatabase from './functions.database.js';
import * as fWeb from './functions.web.js';
import * as fSync from './functions.sync.js';

export default class Role {
    static moduleName = 'Role';

    constructor() {
    }

    /**
     *  Datenbankeinstellungen für die Rollen
     */
    static database = {
        getAll: fDatabase.databaseGetAll,
        getByID: fDatabase.databaseGetById,
        getByKey: fDatabase.databaseGetByKey,
        save: fDatabase.databaseSave
    };

    static web = {
        getList: fWeb.webGetList,
        autocomplete: fWeb.webAutoComplete,
    }

    static sync = {
        all: fSync.syncAll,
    }
}

