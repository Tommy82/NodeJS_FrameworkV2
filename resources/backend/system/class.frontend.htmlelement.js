/**
 * Erstellt ein HTML Input Feld anhand der angegebenen Daten
 * @param {{}} data Daten
 * - key = id+name
 * - value = einzutragender Wert
 */
export function generateHTMLElementText(data) {
    data = checkData(data, "text");
    return `<input type="text" id="${data.key}" name="${data.ident ? data.ident : data.key}" value="${data.value}" class="${data.class}">`;
}

export function generateHTMLElementSelect(data) {
    data = checkData(data, "select");
    let response = `<select id="${data.key}" name="${data.ident ? data.ident : data.key}" size="${data.size}">`;
    if ( data.options.length > 0 ) {
        data.options.forEach(item => {
            response += `<option value="${item.value}">${item.name}</option>`;
        });
    }
    response += "</select>"
    return response;

}

export function generateHTMLElementCheckBox(data) {
    data = checkData(data, "checkbox");
    let checked = "";
    if ( data.value === 1 || data.value === "1" || data.value === "on" ) {
        checked = 'checked';
    }
    return `<input type="checkbox" id="${data.key}" name="${data.ident ? data.ident : data.key}" ${checked} class="${data.class}">`;
}

function checkData(data, type = null) {

    if ( !data.value ) { data.value = ""; }
    if ( !data.class ) { data.class = ""; }
    if ( !data.key ) { data.key = ""; }

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