import {app} from "./class.app.js";

export function tableGenerate(id, head, content, footer) {
    let data = `<table id="${id}" class="display myDataTable">`;
    data += tableGenerateHead(head);
    data += tableGenerateContent(content);
    data += tableGenerateFooter(footer);
    data += `</table>`;
    return data;
}

export function tableGenerateHead(headData) {
    let data = "<thead>";
    if ( headData && headData.length > 0 ) {
        headData.forEach(item => {
            data += `<th>${item.value}</th>`;
        })
    }
    data += "</thead>";
    return data;
}

export function tableGenerateContent(contentData) {
    let data = "<tbody>"
    if ( contentData && contentData.length > 0 ) {
        for ( let i = 0; i < contentData.length; i++ ) {
            data += "<tr>";
            for ( let a = 0; a < contentData[i].length; a++ ) {
                data += `<td>${contentData[i][a].value}</td>`
            }
            data += "</tr>";
        }
    }
    data += "</tbody>";
    return data;
}

export function tableGenerateFooter(footerData) {
    let data = "<tfooter></tfooter>";
    return data;
}

/**
 * Erstellen einer DataTable anhand von Datenbankeinträgen
 * Achtung! Die Tabelle MUSS das Feld "id" haben. Sollte es nicht da sein, muss dieses über die SQL Abfrage entsprechend angelegt werden!
 * @param {string} id Name der Tabelle
 * @param {array} params Parameter für die Abfrage ("sql", "where", "menu")
 * @param {*} database Datenbank welche verwendet werden soll (null = Standarddatenbank)
 * @returns {Promise<string>} HTML DataTable
 */
export async function tableGenerateByDB(id, params, database) {
    return new Promise(async (resolve, reject) => {
        // Datenbank zuordnen
        if ( database == null || database == '' ) { database = app.DB; }

        // SQL Query erstellen
        let sqlQuery = `${params["sql"]} `;
        if ( params["where"] && params["where"].trim() !== '' ) {
            sqlQuery += ` WHERE ${params["where"]} `;
        }

        // Query ausführen
        await database.query(sqlQuery)
            .then(data => {
                // Daten sortieren nach ID
                data.sort((a, b) => ( a.id > b.id ) ? 1 : -1 ); // Sortiere Array nach ID

                //#region Header
                let header = [];
                if ( params.header !== null && params.header.length > 0 ) {
                    params.header.forEach(item => {
                        header.push({value: item});
                    })
                } else {
                    if ( data && data.length > 0 ) {
                        Object.keys(data[0]).forEach(item => {
                            header.push({ value: item });
                        })
                    }
                }
                //#endregion Header

                //#region Content
                let content = [];
                if ( data && data.length > 0 ) {
                    data.forEach(col => {
                        let column = [];
                        let counter = 0;
                        Object.keys(col).forEach(item => {
                            //#region Format - CheckBox
                            let isCheckBox = false;
                            if ( params["colCheckbox"] && params["colCheckbox"].includes(counter)) { isCheckBox = true; }

                            if ( isCheckBox ) {
                                let checked = '';
                                if ( col[item] == 1 || col[item] == '1') { checked = 'checked'; }
                                col[item] = `<input type='checkbox' ${checked} disabled="disabled" />`
                            }
                            //#endregion Format - CheckBox

                            column[counter] = { value: col[item] };
                            counter++;
                        });
                        if ( params["menu"] && params["menu"] != '' ) {
                            let myMenu = params["menu"];
                            myMenu = myMenu.replaceAll("%id%", col.id);
                            column[counter] = { value: myMenu }
                        }
                        content.push(column);
                    });
                }
                //#endregion Content

                //#region Footer
                let footer = [];
                //#endregion Footer

                return resolve(tableGenerate(id, header, content, footer));
            })
            .catch(err => { return reject(err); })
    })
}

/**
 * Erstellt ein Frontend Layout für das Editieren von einzelnen Datenbank-Datensätzen
 * - Hinweis: die Column "id" wird automatisch hinzugefügt!
 * @param {[]} params Parameter für SQL Abfrage
 * @param {*} database Datenbank (null = Standarddatenbank)
 * @returns {Promise<string|*>}
 */
export async function generateEditByID(params, database) {
    return new Promise(async (resolve, reject) => {
        // Datenbank zuordnen
        if (database == null || database == '') {
            database = app.DB;
        }

        let sqlQuery = "SELECT `id` ";
        if ( params && params["columns"].length > 0 ) {
            params["columns"].forEach(col => {
                if ( !col.notInTable ) {
                    sqlQuery += `, \`${col.key}\` `
                    }
                }
            );
        }
        sqlQuery += ` FROM \`${params["table"]}\` `;
        sqlQuery += ` WHERE \`id\` = ${params["id"]} `;
        // Query ausführen
        await database.query(sqlQuery)
            .then(data => {
                let myFrontendData = "<form method='post' action=''>";

                myFrontendData += "<table id='editTable' style='width: 100%'>";
                if ( params && params["columns"].length > 0 ) {
                    params["columns"].forEach(col => {
                        //#region Set Database Value
                        if ( !col.notInTable && data.length > 0 ) {
                            col.value = data[0][col.key];
                            if ( !col.value ) { col.value = ""; }
                        }
                        //#endregion Set Database Value

                        //#region Set Frontend Data
                        myFrontendData += `<tr>`;
                        myFrontendData += `<td><label for="${col.key}">${col.name}</label></td>`;
                        switch ( col.type ) {
                            case "text": myFrontendData += `<td>${app.frontend.HtmlElement.text(col)}</td>`; break;
                            case "select": myFrontendData += `<td>${app.frontend.HtmlElement.select(col)}</td>`; break;
                            case "checkbox": myFrontendData += `<td>${app.frontend.HtmlElement.checkBox(col)}`; break;
                            default: myFrontendData += `<td></td>`; break;
                        }
                        myFrontendData += `</tr>`;
                        //#endregion Set Frontend Data
                    });
                }
                myFrontendData += "</table>";

                myFrontendData += "<input type='submit' value='Speichern'>";
                myFrontendData += "<input type='submit' value='Abbrechen'>";
                myFrontendData += "</form>";
                return resolve(myFrontendData);
            })
            .catch(err => {
                return reject(err);
            })
    })
}
