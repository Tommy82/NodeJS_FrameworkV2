//#region Functions - Table
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

        // Query ausfügreb
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
//#endregion Functions - Table