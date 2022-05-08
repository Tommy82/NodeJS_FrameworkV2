import { Functions as fWeb } from './functions.web.js';
import { Functions as fDatabase } from './functions.database.js';

export default class Settings {
    static moduleName = 'Settings';

    /** Instanziiert eine neue Settingsklasse **/
    constructor() { }

    /** Webkomponente des Moduls **/
    static web = fWeb;

    /** Datenbankkomponente des Moduls **/
    static DB = fDatabase;
}