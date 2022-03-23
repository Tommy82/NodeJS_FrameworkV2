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
}