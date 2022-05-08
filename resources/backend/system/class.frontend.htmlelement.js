/**
 * Frontend Funktionen - HtmlElemente
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

export class Functions {
    static text = generateHTMLElementText;
    static select = generateHTMLElementSelect;
    static checkBox = generateHTMLElementCheckBox;
}

/**
 * Erstellt ein HTML Input Feld anhand der angegebenen Daten
 * @param {{}} data Daten
 * - key = id+name
 * - value = einzutragender Wert
 */
function generateHTMLElementText(data) {
    data = checkData(data, "text");
    return `<input type="text" id="${data.key}" name="${data.ident ? data.ident : data.key}" value="${data.value}" class="${data.class}" ${data.readonly}>`;
}

/**
 * Erstellt ein HTML Select Feld anhand der angegebenen Daten
 * @param {{}}data
 * - key = id+name
 * - ident = Eindeutige Identifizierung (vorrangig vor key)
 * - size = Angezeigte Länge (Standard: 1)
 * - options = Array der Elemente in der Liste [ {value = 1, name= "text" } ]
 * @returns {string}
 */
function generateHTMLElementSelect(data) {
    data = checkData(data, "select");
    let response = `<select id="${data.key}" name="${data.ident ? data.ident : data.key}" size="${data.size}" ${data.readonly}>`;
    if ( data.options.length > 0 ) {
        data.options.forEach(item => {
            response += `<option value="${item.value}">${item.name}</option>`;
        });
    }
    response += "</select>"
    return response;

}

/**
 * Erstellt eine Checkbox anhand der angegebenen Daten
 * @param {{}}data Parameter für die Erstellung
 * - value |  1 = checked / 0 = not checked
 * - key = id + name
 * - ident = eindeutige kennung (vorrangig vor key)
 * @returns {string}
 */
function generateHTMLElementCheckBox(data) {
    data = checkData(data, "checkbox");
    let checked = "";
    if ( data.value === 1 || data.value === "1" || data.value === "on" ) {
        checked = 'checked';
    }
    return `<input type="checkbox" id="${data.key}" name="${data.ident ? data.ident : data.key}" ${checked} class="${data.class}" ${data.readonly}>`;
}

/**
 * Prüfung der Daten für die HtmlElemente
 * @param {{}} data zu prüfende Daten
 * @param {string} type Art des HtmlElements
 * @returns {*}
 */
function checkData(data, type = null) {

    if ( !data.value ) { data.value = ""; }
    if ( !data.class ) { data.class = ""; }
    if ( !data.key ) { data.key = ""; }

    if ( !data.editable ) { data.readonly = 'readonly' } else { data.readonly = ''; }

    switch ( type ) {
        case "select":
            if ( !data.size) { data.size = 1; }
            if ( !data.options || !Array.isArray(data.options)) { data.options = "[]"; }
            break;
        default:
            break;
    }


    return data;
}