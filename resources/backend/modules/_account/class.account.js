import * as fWeb from './functions.web.js';
import * as fDatabase from './functions.database.js';

/** Modul - Account */
export default class Account {
    static moduleName = 'Account';

    /**
     * Instanziiert eine neue AccountKlasse
     */
    constructor() {
    }

    /**
     * Klasse für die Webkomponente dieses Moduls
     * @type {{toLogin: function(*, *): void,
     *         toAccountSingle: function(*, *): void,
     *         toAccountList: function(*, *): void,
     *         checkLogin: function(*, *): void
     *         }}
     */
    static web = {
        toLogin: fWeb.webToLogin,
        checkLogin: fWeb.checkLogin,
        toAccountList: fWeb.toAccountList,
        toAccountSingle: fWeb.toAccountSingle,
    }

    /**
     * Klasse für die Datenbank Komponente dieses Moduls
     * @type {{getByID: function(int): Promise<*>, getByName: function(string): Promise<*>, save: function(*): Promise<*>}}
     */
    static database = {
        getByID: fDatabase.databaseGetById,
        getByName: fDatabase.databaseGetByName,
        save: fDatabase.databaseSave
    };

}


