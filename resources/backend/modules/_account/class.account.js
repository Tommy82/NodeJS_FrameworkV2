import { app } from "../../system/class.app.js";
import * as fWeb from './functions.web.js';
import * as fDatabase from './functions.database.js';
import {DBAccount} from "./settings.entities.js";

export default class Account {
    static moduleName = 'Account';

    constructor() {
    }

    static web = {
        toLogin: fWeb.webToLogin,
        toAccountList: fWeb.toAccountList,
        toAccountSingle: fWeb.toAccountSingle,
    }

    static database = {
        getByID: fDatabase.databaseGetById,
        getByName: fDatabase.databaseGetByName,
        save: fDatabase.databaseSave
    };
}

class AccountInstall {
    constructor() { }

    entities = [  DBAccount ];

    rights = [ ];

    moduleName = Account.moduleName;

    async init() {
    }

    async install() {
    }

    async start() {
    }
}
app.addModule(new AccountInstall());

