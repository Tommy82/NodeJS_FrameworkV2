import { app } from "./class.app.js";
import * as fTable from './class.frontend.table.js';
import * as fHTMLElement from './class.frontend.htmlelement.js';
import * as fAutoComplete from "./class.frontend.autocomplete.js";
import {saveEditByID} from "./class.frontend.table.js";

export default class Frontend {

    /**
     * Autocomplete Funktionen
     * { key: [string], callback: [function] }
     * @type {[]}
     */
    autocomplete = [];

    table = {
        generate: fTable.tableGenerate,
        generateByDB: fTable.tableGenerateByDB,
        generateEditByID: fTable.generateEditByID,
        saveEditByID: fTable.saveEditByID,
    }

    HtmlElement = {
        text: fHTMLElement.generateHTMLElementText,
        select: fHTMLElement.generateHTMLElementSelect,
        checkBox: fHTMLElement.generateHTMLElementCheckBox
    }

    parameters = {
        /** SQL Abfrage */
        sql: '',
        /** SQL Query - Where */
        where: '',
        /** Post Data **/
        body: [],
        /** Header */
        header: [],
        /** Menu */
        menu: '',
        /** colCheckbox */
        colCheckbox: [],
        /** addAdd */
        addAdd: '',
        /** url_save */
        url_save: '',
        /** savedData */
        savedData: {},
        /** Tabellen für die Abfrage */
        columns: [],
        table: '',
        id: 0,
    }

    static afterStart = fAutoComplete.afterStart;
}




