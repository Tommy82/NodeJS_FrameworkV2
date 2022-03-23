/**
 * Frontend Funktionen
 *
 * @module:     System
 * @version:    1.0
 * @revision:   1
 * @author:     Thomas Göttsching
 * @company:    Thomas Göttsching
 *
 * Wichtiger Hinweis: Änderungen an dieser Datei können die Updatefähigkeit beeinträchtigen.
 * Daher wird dringend davon abgeraten!
 */


import { Functions as fTable } from './class.frontend.table.js';
import { Functions as fHTMLElement } from './class.frontend.htmlelement.js';
import { Functions as fAutoComplete } from "./class.frontend.autocomplete.js";
import { default as ClassParameters } from './class.frontend.parameters.js';

export default class Frontend {

    /**
     * Autocomplete Funktionen
     * { key: [string], callback: [function] }
     * @type {[]}
     */
    autocomplete = [];

    table = fTable;

    HtmlElement = fHTMLElement;

    parameters = ClassParameters;

    /**
     * Wird nach dem Systemstart ausgeführt!
     */
    static afterStart () {
        // Einbinden der AutoComplete Parameter
        fAutoComplete.afterStart();
    }
}






