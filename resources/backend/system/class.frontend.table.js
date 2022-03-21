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
    let data = `<tfoot>${footerData}</tfoot>`;
    return data;
}

/**
 * Erstellen einer DataTable anhand von Datenbankeinträgen
 * Achtung! Die Tabelle MUSS das Feld "id" haben. Sollte es nicht da sein, muss dieses über die SQL Abfrage entsprechend angelegt werden!
 * @param {string} id Name der Tabelle
 * @param {*} params Parameter für die Abfrage ("sql", "where", "menu")
 * @param {*} database Datenbank welche verwendet werden soll (null = Standarddatenbank)
 * @returns {Promise<string>} HTML DataTable
 */
export async function tableGenerateByDB(id, params, database) {
    return new Promise(async (resolve, reject) => {

        let response = "";
        let addAdded = false;

        // Datenbank zuordnen
        if ( database == null || database === '' ) { database = app.DB; }

        // SQL Query erstellen
        let sqlQuery = `${params.sql} `;
        if ( params.where && params.where.trim() !== '' ) {
            sqlQuery += ` WHERE ${params.where} `;
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
                let add = `<template id="${id}_addRow" class="newRow"><tr>`;
                if ( data && data.length > 0 ) {
                    data.forEach(col => {
                        let column = [];
                        let counter = 0;
                        Object.keys(col).forEach(item => {
                            //#region Format - CheckBox
                            let isCheckBox = false;
                            if ( params.colCheckbox && params.colCheckbox.includes(counter)) { isCheckBox = true; }

                            if ( isCheckBox ) {
                                let checked = '';
                                if ( col[item] === 1 || col[item] === '1') { checked = 'checked'; }
                                //col[item] = `<input type='checkbox' ${checked} disabled="disabled" />`
                                col[item] = `<input type='checkbox' ${checked} disabled="disabled" />`;
                            }
                            //#endregion Format - CheckBox

                            if ( !addAdded ) {
                                // ID nicht mit adden
                                if ( item === 'id' ) {
                                    add += `<td></td>`;
                                } else {
                                    // Check if Textbox
                                    if ( isCheckBox ) { add += `<td><input type="checkbox" name="${item}" id="${item}" /></td>` }
                                    // Add as Text
                                    else { add += `<td><input type="text" name="${item}" id="${item}" /></td>` }
                                }
                            }

                            column[counter] = { value: col[item] };
                            counter++;
                        });
                        if ( params.menu && params.menu !== '' ) {
                            let myMenu = params.menu.toString();
                            //myMenu = myMenu.replaceAll("%id%", col.id);
                            myMenu = myMenu.replace(/%id%/g, col.id);
                            column[counter] = { value: myMenu }
                            if ( !addAdded ) {
                                add += "<td><input type='submit' value='Speichern' name='fastSave'/>&nbsp;<input type='button' value='Abbrechen' onclick='dataTable_Break();'></td>"
                            }
                        }
                        content.push(column);
                        if ( !addAdded ) {
                            add += "</tr></template>";
                        }

                        addAdded = true;
                    });
                }
                //#endregion Content

                //#region Footer
                let footer = [];
                if ( params.addAdd) {
                    response += add;
                    response += `<input type="button" value="Hinzufügen" onclick="dataTable_Add('${id}');" />`;
                    response += `<form action=\"${params.url_fastsave}\" method=\"post\">`;
                }
                //#endregion Footer
                response += tableGenerate(id, header, content, footer);

                if ( params.addAdd) { response += "</form>"; }

                return resolve(response);
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
        if (database == null || database === '') {
            database = app.DB;
        }

        let sqlQuery = "SELECT `id` ";
        if ( params && params.columns.length > 0 ) {
            params.columns.forEach(col => {
                if ( !col.notInTable ) {
                    sqlQuery += `, \`${col.key}\` `
                    }
                }
            );
        }
        sqlQuery += ` FROM \`${params.table}\` `;
        sqlQuery += ` WHERE \`id\` = ${params.id} `;
        // Query ausführen
        await database.query(sqlQuery)
            .then(data => {
                let myFrontendData = "<form method='post' action=''>";

                myFrontendData += "<table id='editTable' style='width: 100%'>";
                if ( params && params.columns.length > 0 ) {
                    params.columns.forEach(col => {
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

                myFrontendData += "<input type='submit' value='Speichern' name='btnSave'>";
                myFrontendData += "<input type='submit' value='Abbrechen' name='btnBreak'>";
                myFrontendData += "</form>";
                return resolve(myFrontendData);
            })
            .catch(err => {
                return reject(err);
            })
    })
}

/**
 * Speichert das Frontend Layout in die Datenbank
 * @param {[]} params
 * @param {*} database
 * @returns {Promise<void>}
 */
export async function saveEditByID(params, database) {
    return new Promise((resolve, reject) => {

        // Datenbank zuordnen
        if (database == null || database === '') {
            database = app.DB;
        }

        // Set FastSave
        params.fastSave = false;
        if ( params && params.body ) {
            params.fastSave = params.body["fastSave"] && (params.body["fastSave"] === 1 || params.body["fastSave"] === "1" || params.body["fastSave"] === "save") ? true : false;
        }



        if ( params && params.columns && params.columns.length > 0 ) {
                let sqlQuery = "";
                //#region Update Database
                if ( params.id && parseInt(params.id) > 0 ) {
                    sqlQuery += ` UPDATE \`${params.table}\` SET`;

                    let first = true;
                    params.columns.forEach(col => {
                        if ( !col.notInTable && (params.fastSave == false || ( params.fastSave === true && col.fastSave === true))) {
                            if ( !first ) {
                                sqlQuery += ", ";
                            } else {
                                first = false;
                            }

                            let value = params.body[col.key];
                            sqlQuery += appendValueToSQL("insert", col, value);

                        }
                    })

                    sqlQuery += ` WHERE \`id\`= ${params.id} `;
                }
                //#endregion Update Database
                //#region Insert Database
                else {
                    sqlQuery += ` INSERT INTO \`${params.table}\` (`;

                    let first = true;
                    params.columns.forEach(col => {
                        if ( !col.notInTable && (params.fastSave == false || ( params.fastSave === true && col.fastSave === true))) {
                            if (!first) { sqlQuery += ", "; }
                            else { first = false; }
                            sqlQuery += " `" + col.key + "` ";
                        }
                    });

                    sqlQuery += `) VALUES (`;

                    first = true;
                    params.columns.forEach(col => {
                        if (!col.notInTable) {
                            let value = params && params.body && params.body[col.key] ? params.body[col.key] : '';

                            if (!first) { sqlQuery += ", "; }
                            else { first = false; }

                            sqlQuery += appendValueToSQL("update", col, value);
                        }
                    });
                    sqlQuery += `) `;

                }
                //#endregion Insert Database

                app.DB.query(sqlQuery)
                    .then(data => {
                        return resolve(data);
                    })
                    .catch(err => {
                        return reject(err);
                    })
        }
    })
}

function appendValueToSQL(type, col, value) {
    let response = "";

    if ( type === "insert" ) {
        response += ` \`${col.key}\` = `;
    }

    switch ( col.type ) {
        case 'checkbox':
            value = value && value === 'on' ? '1' : '0';
            if ( value === undefined ) { value = '0'; }
            response += ` ${value} `;
            break;
        case 'integer':
            response += ` ${parseInt(value)} `;
            break;
        case 'float':
            response += ` ${parseFloat(value)} `;
            break;
        case 'double':
            response += ` ${parseFloat(value)} `;
            break;
        default:
            response += ` '${value}' `;
            break;
    }
    return response;
}

function checkParams(type, params) {

    if ( !params ) { params = []; }
    if ( !params.addAdd ) { params.addAdd = false; }
    if ( !params.colCheckbox ) { params.colCheckbox = []; }
    if ( !params.header ) { params.header = []; }
    if ( !params.menu ) { params.menu = ''; }
    if ( !params.sql ) { params.sql = ''; }
    if ( !params.url_save ) { params.url_save  = "/backend/account/0"; }
    if ( !params.where ) { params.where = ''; }



}