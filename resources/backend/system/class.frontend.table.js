/**
 * Frontend Funktionen - Tabellen
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

import {app} from "./class.app.js";

export class Functions {
    static generate = tableGenerate;
    static generateByDB = tableGenerateByDB;
    static generateEditByID = generateEditByID;
    static generateByObject = generateByObject;
    static saveEditByID = saveEditByID;
}

function tableGenerate(id, head, content, footer) {
    let data = `<table id="${id}" class="display myDataTable">`;
    data += tableGenerateHead(head);
    data += tableGenerateContent(content);
    data += tableGenerateFooter(footer);
    data += `</table>`;
    return data;
}

function tableGenerateHead(headData) {
    let data = "<thead>";
    if ( headData && headData.length > 0 ) {
        headData.forEach(item => {
            data += `<th>${item.value}</th>`;
        })
    }
    data += "</thead>";
    return data;
}

function tableGenerateContent(contentData) {
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

function tableGenerateFooter(footerData) {
    return `<tfoot>${footerData}</tfoot>`;
}

/**
 * Erstellen einer DataTable anhand von Datenbankeinträgen
 * Achtung! Die Tabelle MUSS das Feld "id" haben. Sollte es nicht da sein, muss dieses über die SQL Abfrage entsprechend angelegt werden!
 * @param {string} id Name der Tabelle
 * @param {*} params Parameter für die Abfrage ("sql", "where", "menu")
 * @param {*} database Datenbank welche verwendet werden soll (null = Standarddatenbank)
 * @returns {Promise<string>} HTML DataTable
 */
async function tableGenerateByDB(id, frontendName, params, database) {
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

                        if ( !params.noMenu && (!params.menu || params.menu === '' ) ) {
                            params.menu = '-';
                        }

                        if ( params.menu && params.menu !== '' ) {
                            let myMenu = params.menu.toString();
                            //myMenu = myMenu.replaceAll("%id%", col.id);
                            //myMenu = myMenu.replace(/%id%/g, col.id);
                            myMenu = generateStringByColumn(col, myMenu);
                            column[counter] = { value: myMenu }
                            if ( !addAdded ) {
                                add += "<td><input type='submit' value='Speichern' name='btnSave'/>&nbsp;<input type='button' value='Abbrechen' name='btnBreak' onclick='dataTable_Break();'></td>"
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
                    response += `<input type="button" value="Hinzufügen" onclick="dataTable_Add('${id}');" class="base_style btn_dataTableAdd" />`;
                    response += `<input type="button" value="Neu laden" onclick="javascript: window.location.href = location.href;" class="base_style btn_dataTableReload">`
                    response += `<form action=\"${params.url_fastsave}\" method=\"post\">`;
                }
                //#endregion Footer
                response += tableGenerate(id, header, content, footer);

                if ( params.addAdd) { response += "</form>"; }

                // Hinzufügen der Daten für das Frontend
                params.addScript(`setDataTable('${id}');`);
                params.addData(frontendName, response);

                return resolve({
                    params: params,
                    data: response,
                });
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
async function generateEditByID(params, database) {
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

                myFrontendData += "<table class='editTable' style='width: 100%'>";
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
                        myFrontendData += `<td class="edit_label"><label for="${col.key}">${col.name}</label></td>`;
                        switch ( col.type ) {
                            case "text": myFrontendData += `<td class="edit_input">${app.frontend.HtmlElement.text(col)}</td>`; break;
                            case "select": myFrontendData += `<td class="edit_input">${app.frontend.HtmlElement.select(col)}</td>`; break;
                            case "checkbox": myFrontendData += `<td class="edit_input">${app.frontend.HtmlElement.checkBox(col)}</td>`; break;
                            default: myFrontendData += `<td class="edit_input"></td>`; break;
                        }
                        if ( !col.description ) { col.description = ''; }
                        myFrontendData += `<td class="edit_description">${col.description}</td>`;
                        myFrontendData += `</tr>`;
                        //#endregion Set Frontend Data
                    });
                }
                myFrontendData += "</table>";
                if (params.appendBeforeSaveButtons && params.appendBeforeSaveButtons !== '') {
                    myFrontendData += params.appendBeforeSaveButtons;
                }
                myFrontendData += "<input type='submit' value='Speichern' name='btnSave'>";
                myFrontendData += "<input type='submit' value='Abbrechen' name='btnBreak'>";
                myFrontendData += "</form>";
                //return resolve(myFrontendData);
                return resolve({
                    params: params,
                    data: myFrontendData
                })
            })
            .catch(err => {
                return reject(err);
            })
    })
}

/**
 * Erstellt ein Freontend Layout (Table) anhand eines Arrayobjektes
 * @param params
 * @returns {Promise<void>}
 */
async function generateByObject(id, frontendName, params = new app.frontend.parameters(), tableSettings = '') {
    return new Promise(async (resolve, reject) => {
        //#region Header
        let header = [];

        if ( params.header && params.header.length > 0 ) {
            params.header.forEach(item => {
                header.push({value: item});
            })
        } else {
            params.columns.forEach(item => {
                header.push({ value: item.name});
            })
        }
        //#endregion Header

        //#region Content
        let content = [];
        if ( !params.columns || params.columns.length === 0 ) {
            // ToDo - Fülle anhand params.orgObject
        }

        if ( params.orgObject && params.orgObject.length > 0 ) {
            await app.helper.lists.asyncForEach(params.orgObject, async (obj) => {
                //params.orgObject.forEach(async obj => {
                let column = [];
                let counter = 0;
                await app.helper.lists.asyncForEach(params.columns, async(item) => {
                    //await params.columns.forEach( async item => {
                    let key = item.key;
                    let value = "";

                    if ( item.value && typeof(item.value) === "function" ) {

                        let param1 = item.valueParam1 ? item.valueParam1 : null;
                        let param2 = item.valueParam2 ? item.valueParam2 : null;
                        let param3 = item.valueParam3 ? item.valueParam3 : null;
                        let param4 = item.valueParam4 ? item.valueParam4 : null;
                        let param5 = item.valueParam5 ? item.valueParam5 : null;

                        if ( param1 && typeof(param1) === "string") { param1 = generateStringByColumn(obj, param1); }
                        if ( param2 && typeof(param2) === "string") { param2 = generateStringByColumn(obj, param2); }
                        if ( param3 && typeof(param3) === "string") { param3 = generateStringByColumn(obj, param3); }
                        if ( param4 && typeof(param4) === "string") { param4 = generateStringByColumn(obj, param4); }
                        if ( param5 && typeof(param5) === "string") { param5 = generateStringByColumn(obj, param5); }

                        switch ( item.valueParamCount ) {
                            case 0: value = item.value(); break;
                            case 1: value = await item.value(param1); break;
                            case 2: value = await item.value(param1, param2);break;
                            case 3: value = await item.value(param1, param2, param3);break;
                            case 4: value = await item.value(param1, param2, param3, param4);break;
                            case 5: value = await item.value(param1, param2, param3, param4, param5);break;
                        }
                    } else {
                        value = item.value ? item.value : obj[key];
                    }
                    let ident = item.ident;



                    //#region Format - CheckBox
                    let isCheckBox = false;
                    if ( params.colCheckbox && params.colCheckbox.includes(counter)) { isCheckBox = true; }

                    if ( isCheckBox ) {
                        let checked = '';
                        if ( value === 1 || value === '1') { checked = 'checked'; }
                        //col[item] = `<input type='checkbox' ${checked} disabled="disabled" />`
                        value = `<input type='checkbox' ${checked} disabled="disabled" />`;
                    }
                    //#endregion Format - CheckBox

                    if ( typeof(ident) == 'string' && ident.includes('%')) {
                        ident = generateStringByColumn(obj, ident);
                    }

                    if ( item.editAble === true || item.editable === true ) {
                        let tmpItem = {};
                        tmpItem.value = value;
                        tmpItem.key = ident && ident !== null ? ident : key;
                        tmpItem.class = "";
                        tmpItem.ident = ident && ident !== null ? ident : key;
                        switch ( item.type ) {
                            case "text": value = `${app.frontend.HtmlElement.text(tmpItem)}`; break;
                            case "int":
                                try {
                                    tmpItem.value = parseInt(tmpItem.value);
                                    value = `${app.frontend.HtmlElement.text(tmpItem)}`;
                                } catch ( err ) { value = '0'; }
                                break;
                            case "double":
                                try {
                                    if ( !item.round ) { item.round = 2; }
                                    tmpItem.value = parseFloat(tmpItem.value).toFixed(item.round);
                                    value = `${app.frontend.HtmlElement.text(tmpItem)}`;
                                } catch ( err ) { value = '0'; }
                                break;
                            case "select": value = `${app.frontend.HtmlElement.select(tmpItem)}`; break;
                            case "checkbox": value = `${app.frontend.HtmlElement.checkBox(tmpItem)}`; break;
                        }
                    } else {
                        switch ( item.type ) {
                            case "int":
                                try {
                                    if ( value && value != '' ) { value = parseInt(value); }
                                    else { value = '0' };
                                } catch ( err ) { value = '0'; }
                                break;
                            case "double":
                                if ( !item.round ) { item.round = 2; }
                                if ( value && value != '' ) {
                                    //value = parseFloat(value).toFixed(item.round);
                                    value = new Intl.NumberFormat('de-DE', { minimumFractionDigits: item.round, maximumFractionDigits: item.round }).format(value)
                                }
                                else { value = '0' };
                                break;
                            default:
                                break;
                        }
                    }

                    column[counter] = { value: value };
                    counter++;
                });
                content.push(column);
            })
        }
        //#endregion Content

        //#region Footer
        let footer = [];
        //#endregion Footer

        let response = tableGenerate(id, header, content, footer);

        // Hinzufügen der Daten für das Frontend
        params.addScript(`setDataTable('${id}', ${tableSettings});`);
        params.addData(frontendName, response);

        return resolve({
            data: response,
            params: params,
        });
    })
}

/**
 * Ersetzt ein Platzhalter (%[COLUMN]%) in einem String mit dem Wert des Datzensatzes
 * @param {*} column Datensatz
 * @param {string} text Text welcher ersetzt werden soll
 * @returns {*}
 */
function generateStringByColumn(column, text) {
    let response = text;

    if ( column && typeof(column) === "object") {
        Object.keys(column).forEach(item => {
            if ( !column[item] ) { column[item] = ''; }
            response = app.helper.converter.replaceAll(response, '%' + item + '%', column[item]);
        })
    }
    return response;
}

/**
 * Speichert das Frontend Layout in die Datenbank
 * @param {[]} params
 * @param {*} database
 * @returns {Promise<void>}
 */
async function saveEditByID(params, database) {
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
                        sqlQuery += app.helper.converter.valueForSQL("insert", col, value);

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

                        sqlQuery += app.helper.converter.valueForSQL("update", col, value);
                    }
                });
                sqlQuery += `) `;

            }
            //#endregion Insert Database

            app.DB.query(sqlQuery)
                .then(data => {
                    return resolve({
                        data: data,
                        params: params
                    });
                })
                .catch(err => {
                    return reject(err);
                })
        }
    })
}
