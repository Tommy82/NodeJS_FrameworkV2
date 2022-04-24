/**
 * Frontend Funktionen - Parameter
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

export default class Parameters {
    /** SQL Abfrage */
    sql = '';
    /** SQL Query - Where */
    where = '';
    /** Post Data **/
    body= [];
    /** Header */
    header= [];
    /** Menu */
    menu= '';
    /** colCheckbox */
    colCheckbox= [];
    /** addAdd */
    addAdd= '';
    /** url_save */
    url_save= '';
    /** savedData */
    savedData= {};
    /** Tabellen für die Abfrage */
    columns= [];
    /** Name der Tabelle in der Datenbank **/
    table= '';
    /** ID des Datensatzes in der Datenbank **/
    id= 0;
    /** weitere HTML Elemente vor auf dem Edit Feld vor dem Speichern **/
    appendBeforeSaveButtons= '';
    /** JSON-Array | Wichtig für Erstellung einer Tabelle aus einem Objekt **/
    orgObject = [];
    /** keine Menüspalte vorhanden? **/
    noMenu = false;
    /**
     * Fehlermeldungen für das Frontend
     * @example [{field: "role", text: "Rolle darf nicht leer sein!"}]
    **/
    errors = [];

    /** Daten für die Frontend Ausgabe (ACHTUNG! Diese Daten werden KOMPLETT an das Frontend übermittelt! (Thema: Security!)) **/
    output = {
        /** Seitentitel **/
        title: '',
        /** Scripte (z.B. Javascript **/
        scripts: '',
        /** Styles **/
        styles: '',
        /** AutoComplete **/
        AUTOCOMPLETE: [],
    }

    /**
     * Hinzufügen eines neuen Scripts für das Frontend
     * @param script
     */
    addScript(script) {
        this.output.scripts += script;
    }

    /**
     * Hinzufügen eines neuen Styles für das Frontend
     * @param style
     */
    addStyle(style) {
        this.output.styles += style;
    }

    addData(key, data) {
        this.output[key] = data;
    }

    addAutocomplete(fieldID, filter, callback = '') {
        this.output.AUTOCOMPLETE.push({fieldID: fieldID, filter: filter, callback: callback});
    }
}