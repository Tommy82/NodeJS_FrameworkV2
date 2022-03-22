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
    table= '';
    id= 0;
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