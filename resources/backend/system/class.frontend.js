export default class Frontend {
    table = {
        generate: tableGenerate
    }

    HtmlElement = {
        text: generateHTMLElementText,
        select: generateHTMLElementSelect,
        checkBox: generateHTMLElementCheckBox
    }

}

//#region Functions - Table
function tableGenerate(id, head, content, footer) {
    let data = `<table id="${id}" class="myDataTable">`;
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
            if ( contentData[i].columns && contentData[i].columns.length > 0 ) {
                data += "<tr>";
                for ( let a = 0; a < contentData[i].columns.length; a++ ) {
                    data += `<td>${contentData[i].columns[a].value}</td>`
                }
                data += "</tr>";
            }
        }
    }
    data += "</tbody>";
    return data;
}

function tableGenerateFooter(footerData) {
    let data = "<tfooter></tfooter>";
    return data;
}
//#endregion Functions - Table

function generateHTMLElementText() {
}

function generateHTMLElementSelect() {
}

function generateHTMLElementCheckBox() {
}
