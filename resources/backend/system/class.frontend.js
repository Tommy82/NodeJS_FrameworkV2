import { app } from "./class.app.js";
import * as fTable from './class.frontend.table.js';
import * as fHTMLElement from './class.frontend.htmlelement.js';
import * as fAutoComplete from "./class.frontend.autocomplete.js";

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

    }

    HtmlElement = {
        text: fHTMLElement.generateHTMLElementText,
        select: fHTMLElement.generateHTMLElementSelect,
        checkBox: fHTMLElement.generateHTMLElementCheckBox
    }

    static afterStart = fAutoComplete.afterStart;
}




