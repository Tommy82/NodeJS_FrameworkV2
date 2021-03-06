$(document).ready(function () {
    $('.toOverlay').click(function(e) {
        e.preventDefault();
        //let uri = "http://localhost:3000" + $(this).attr("href");
        let uri = $(this).attr("href");

        $('#overlay_iframe').attr("src", uri);
        $('#overlayIFrame').show();
        return false;
    })

    $('#overlayIFrameContentHeaderClose').click(function(e) {
        e.preventDefault();
        $('#overlayIFrame').hide();
        return false;
    });

    $('#overlayIFrameCOntentHeaderRefresh').click(function(e) {
        e.preventDefault();
        let iframe = document.getElementById('overlay_iframe');
        iframe.src = iframe.src;
    })

    $("form").submit(function(e){ return sendForm($(this), e) });

    $('.btnDelete').click(function(e) {
        e.preventDefault();
        let uri = $(this).attr("href");
        let param1 = $(this).attr("value1");
        let param2 = $(this).attr("value2");
        let param3 = $(this).attr("value3");

        askForDelete(uri, param1, param2, param3);
    });
});

function overlayClose() {
    $('#overlayIFrame').hide();
    return false;
}

function setDataTable(id, params) {
    if ( !params ) {
        params = {
            searching: true,
            paging: true,
            filter: true,
            info: true,
            buttons: [
                { extend: 'excelHtml5', title: 'Data Export' },
                { extend: 'pdfHtml5', title: 'Data Export' },
                { extend: 'csv', title: 'Data Export' },
            ],
            lengthMenu: [ [ 10, 25, 50, 100 -1 ], [ '10', '25', '50', '100', 'Alle' ]]
        }
    } else {
        if ( params.filter === undefined ) { params.filter = true; }
        if ( params.searching === undefined ) { params.searching = true; }
        if ( params.info === undefined) { params.info = true; }
        if ( params.paging === undefined ) { params.paging = true; }
        if ( params.buttons === undefined ) { params.buttons = [
            { extend: 'excelHtml5', title: 'Data Export' },
            { extend: 'pdfHtml5', title: 'Data Export' },
            { extend: 'csv', title: 'Data Export' },
            ];
        }
        if ( params.lengthMenu === undefined ) {
            params.lengthMenu = [
                [ 10, 25, 50, 100, -1 ],
                [ '10', '25', '50', '100', 'Alle' ]
            ];
        }
    }


    // Setup - add a text input to each footer cell
    if ( params.filter ) {
        $('#' + id + ' thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#' + id + ' thead');
    }

    let table = $('#' + id).DataTable({
        dom: 'Blfrtip',
        buttons: params.buttons,
        lengthMenu: params.lengthMenu,
        orderCellsTop: params.filter,
        fixedHeader: true,
        responsive: true,
        searching: params.searching,
        paging: params.paging,
        info: params.info,
        initComplete: function () {
            let api = this.api();

            // For each column
            api
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    let cell = $('.filters th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    let title = $(cell).text();

                    if ($(api.column(colIdx).header()).index() >= 0) {
                        $(cell).html('<input type="text" placeholder="' + title + '"/>');
                    }

                    // On every keypress in this input
                    $(
                        'input',
                        $('.filters th').eq($(api.column(colIdx).header()).index())
                    )
                        .off('keyup change')
                        .on('keyup change', function (e) {
                            e.stopPropagation();

                            // Get the search value
                            $(this).attr('title', $(this).val());
                            let regexr = '({search})'; //$(this).parents('th').find('select').val();

                            let cursorPosition = this.selectionStart;
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search(
                                    this.value !== ''
                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                        : '',
                                    this.value !== '',
                                    this.value === ''
                                )
                                .draw();

                            $(this)
                                .focus()[0]
                                .setSelectionRange(cursorPosition, cursorPosition);
                        });
                });
        },
        language: {
            "emptyTable": "Keine Daten in der Tabelle vorhanden",
            "info": "_START_ bis _END_ von _TOTAL_ Eintr??gen",
            "infoEmpty": "Keine Daten vorhanden",
            "infoFiltered": "(gefiltert von _MAX_ Eintr??gen)",
            "infoThousands": ".",
            "loadingRecords": "Wird geladen ..",
            "processing": "Bitte warten ..",
            "paginate": {
                "first": "Erste",
                "previous": "Zur??ck",
                "next": "N??chste",
                "last": "Letzte"
            },
            "aria": {
                "sortAscending": ": aktivieren, um Spalte aufsteigend zu sortieren",
                "sortDescending": ": aktivieren, um Spalte absteigend zu sortieren"
            },
            "select": {
                "rows": {
                    "_": "%d Zeilen ausgew??hlt",
                    "1": "1 Zeile ausgew??hlt"
                },
                "cells": {
                    "1": "1 Zelle ausgew??hlt",
                    "_": "%d Zellen ausgew??hlt"
                },
                "columns": {
                    "1": "1 Spalte ausgew??hlt",
                    "_": "%d Spalten ausgew??hlt"
                }
            },
            "buttons": {
                "print": "Drucken",
                "copy": "Kopieren",
                "copyTitle": "In Zwischenablage kopieren",
                "copySuccess": {
                    "_": "%d Zeilen kopiert",
                    "1": "1 Zeile kopiert"
                },
                "collection": "Aktionen <span class=\"ui-button-icon-primary ui-icon ui-icon-triangle-1-s\"><\/span>",
                "colvis": "Spaltensichtbarkeit",
                "colvisRestore": "Sichtbarkeit wiederherstellen",
                "copyKeys": "Dr??cken Sie die Taste <i>ctrl<\/i> oder <i>???<\/i> + <i>C<\/i> um die Tabelle<br \/>in den Zwischenspeicher zu kopieren.<br \/><br \/>Um den Vorgang abzubrechen, klicken Sie die Nachricht an oder dr??cken Sie auf Escape.",
                "csv": "CSV",
                "excel": "Excel",
                "pageLength": {
                    "-1": "Alle Zeilen anzeigen",
                    "_": "%d Zeilen anzeigen"
                },
                "pdf": "PDF"
            },
            "autoFill": {
                "cancel": "Abbrechen",
                "fill": "Alle Zellen mit <i>%d<i> f??llen<\/i><\/i>",
                "fillHorizontal": "Alle horizontalen Zellen f??llen",
                "fillVertical": "Alle vertikalen Zellen f??llen"
            },
            "decimal": ",",
            "search": "Suche:",
            "searchBuilder": {
                "add": "Bedingung hinzuf??gen",
                "button": {
                    "0": "Such-Baukasten",
                    "_": "Such-Baukasten (%d)"
                },
                "condition": "Bedingung",
                "conditions": {
                    "date": {
                        "after": "Nach",
                        "before": "Vor",
                        "between": "Zwischen",
                        "empty": "Leer",
                        "not": "Nicht",
                        "notBetween": "Nicht zwischen",
                        "notEmpty": "Nicht leer",
                        "equals": "Gleich"
                    },
                    "number": {
                        "between": "Zwischen",
                        "empty": "Leer",
                        "equals": "Entspricht",
                        "gt": "Gr????er als",
                        "gte": "Gr????er als oder gleich",
                        "lt": "Kleiner als",
                        "lte": "Kleiner als oder gleich",
                        "not": "Nicht",
                        "notBetween": "Nicht zwischen",
                        "notEmpty": "Nicht leer"
                    },
                    "string": {
                        "contains": "Beinhaltet",
                        "empty": "Leer",
                        "endsWith": "Endet mit",
                        "equals": "Entspricht",
                        "not": "Nicht",
                        "notEmpty": "Nicht leer",
                        "startsWith": "Startet mit",
                        "notContains": "enth??lt nicht",
                        "notStarts": "startet nicht mit",
                        "notEnds": "endet nicht mit"
                    },
                    "array": {
                        "equals": "ist gleich",
                        "empty": "ist leer",
                        "contains": "enth??lt",
                        "not": "ist ungleich",
                        "notEmpty": "ist nicht leer",
                        "without": "aber nicht"
                    }
                },
                "data": "Daten",
                "deleteTitle": "Filterregel entfernen",
                "leftTitle": "??u??ere Kriterien",
                "logicAnd": "UND",
                "logicOr": "ODER",
                "rightTitle": "Innere Kriterien",
                "title": {
                    "0": "Such-Baukasten",
                    "_": "Such-Baukasten (%d)"
                },
                "value": "Wert",
                "clearAll": "Alle l??schen"
            },
            "searchPanes": {
                "clearMessage": "Leeren",
                "collapse": {
                    "0": "Suchmasken",
                    "_": "Suchmasken (%d)"
                },
                "countFiltered": "{shown} ({total})",
                "emptyPanes": "Keine Suchmasken",
                "loadMessage": "Lade Suchmasken..",
                "title": "Aktive Filter: %d",
                "showMessage": "zeige Alle",
                "collapseMessage": "Alle einklappen",
                "count": "{total}"
            },
            "thousands": ".",
            "zeroRecords": "Keine passenden Eintr??ge gefunden",
            "lengthMenu": "_MENU_ Zeilen anzeigen",
            "datetime": {
                "previous": "Vorher",
                "next": "Nachher",
                "hours": "Stunden",
                "minutes": "Minuten",
                "seconds": "Sekunden",
                "unknown": "Unbekannt",
                "weekdays": [
                    "Sonntag",
                    "Montag",
                    "Dienstag",
                    "Mittwoch",
                    "Donnerstag",
                    "Freitag",
                    "Samstag"
                ],
                "months": [
                    "Januar",
                    "Februar",
                    "M??rz",
                    "April",
                    "Mai",
                    "Juni",
                    "Juli",
                    "August",
                    "September",
                    "Oktober",
                    "November",
                    "Dezember"
                ]
            },
            "editor": {
                "close": "Schlie??en",
                "create": {
                    "button": "Neu",
                    "title": "Neuen Eintrag erstellen",
                    "submit": "Neu"
                },
                "edit": {
                    "button": "??ndern",
                    "title": "Eintrag ??ndern",
                    "submit": "??ndern"
                },
                "remove": {
                    "button": "L??schen",
                    "title": "L??schen",
                    "submit": "L??schen",
                    "confirm": {
                        "_": "Sollen %d Zeilen gel??scht werden?",
                        "1": "Soll diese Zeile gel??scht werden?"
                    }
                },
                "error": {
                    "system": "Ein Systemfehler ist aufgetreten"
                },
                "multi": {
                    "title": "Mehrere Werte",
                    "info": "Die ausgew??hlten Elemente enthalten mehrere Werte f??r dieses Feld. Um alle Elemente f??r dieses Feld zu bearbeiten und auf denselben Wert zu setzen, klicken oder tippen Sie hier, andernfalls behalten diese ihre individuellen Werte bei.",
                    "restore": "??nderungen zur??cksetzen",
                    "noMulti": "Dieses Feld kann nur einzeln bearbeitet werden, nicht als Teil einer Mengen-??nderung."
                }
            }
        }
    });
}

function dataTable_Add(id) {
    let template = $('#' + id + '_addRow').html();
    $('#' + id + " tbody").append(template);
    $('.btn_dataTableAdd').prop('disabled', true);
    $('.btn_dataTableReload').prop('disabled', true);
}

function dataTable_Break() {
    // Reload Window
    window.location = window.location.href;
}

function addAutoComplete(fieldID, filter, callback) {
    $( fieldID ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: page.prefix + "/backend/autocomplete/" + filter + "/" + request.term,
                dataType: "json",
                data: {
                    q: request.term
                },
                success: function( data ) {
                    response( data );
                },
            });
        },
        minLength: 2,
        select: function( event, ui ) {
            event.preventDefault();
            if ( !callback || callback === '' ) {
                $(fieldID).val(ui.item.value);
            } else {
                callback(fieldID, ui.item);
            }

        },
        open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });

}

function askForDelete(uri, type, id, name) {

    // ToDo: ggfl. abfragen ob andere Abfrage m??glich

    let message = "Soll der Datensatz wirklich gel??scht werden?";

    if ( id && id != '' ) {
        message += "<br>- Id: " + id;
    }

    if ( name && name != '' ) {
        message += "<br>- Name: " + name;
    }

    $.confirm({
        title: 'Datensatz entfernen',
        content: message,
        boxWidth: '30%',
        useBootstrap: false,
        buttons: [
            {
                text: 'Ja',
                action: function() {
                    $.ajax({
                        url: uri,
                        dataType: "json",
                        data: {
                        },
                        success: function( data ) {
                            $(this.parent).dialog('close');
                            if ( data && data.success && data.success === "success" ) {
                                window.location = window.location.href;
                            } else {
                                if ( data && data.success === "error" ) {
                                    window.alert(data.error);
                                } else {
                                    window.alert("Fehler beim L??schen der Daten");
                                }
                            }

                        }
                    })
                }
            },
            {
                text: 'Nein',
                action: function() {
                    $(this.parent).dialog('close');
                }
            }
        ]
    })
}

function sendForm(form, e) {

    let currButton = $(document.activeElement).attr("name");

    switch ( currButton ) {
        case "btnSave":
            // Button Speichern
            let data = {};
            $.each(form.serializeArray(), function(i, field) {
                let input = $('input[name='+field.name+']');
                field.value = $.trim(field.value);
                data[field.name] = field.value;
            })

            let action = form.attr("action");
            let method = form.attr("method");
            if ( !action || action.trim() === "") {
                action = location;
            }

            $.ajax({
                type: method,
                url: action,
                data: data,
                success: function(res) {
                    if ( res && res.success && res.success === "success") {
                        if ( res.redirect && res.redirect != '' ) {
                            if ( res.redirectOverlay && (res.redirectOverlay === '1' || res.redirectOverlay === 1)) {
                                window.location.href = res.redirect;
                            } else {
                                parent.location.href = res.redirect;
                            }
                        } else {
                            parent.location.href = parent.location; // Reload Parent Page
                        }
                    } else {
                        if ( res && res.success && res.success === "error" ) {
                            if ( res.data && res.data.length > 0 ) {
                                let errorMessage = "Folgende Fehler sind aufgetreten:\r\n\r\n";
                                res.data.forEach(error => {
                                    if ( error && error.field && error.field !== '') {
                                        $('#' + error.field).addClass('error');
                                    };
                                    if ( error && error.text && error.text !== '' ) {
                                        errorMessage += "- " + error.text + "\r\n";
                                    }
                                });
                                window.alert(errorMessage);
                                if ( res.redirect && res.redirect != '' ) {
                                    parent.location.href = res.redirect;
                                }
                            } else {
                                console.log(res);
                                window.alert("Fehler beim verarbeiten der R??ckmeldedaten. Bitte pr??fen Sie das Log!");
                            }
                        } else {
                            console.log(res);
                            window.alert("Fehler beim verarbeiten der R??ckmeldedaten. Bitte pr??fen Sie das Log!");
                        }
                    }
                },
                error: function(err) {
                    console.log(err);
                    window.alert("Es ist ein Fehler aufgetreten. Bitte pr??fen Sie das Log!")
                }
            });
            break;
        case "btnBreak":
            parent.location.href = parent.location; // Reload Parent Page
            break;
        default:
            return true;
            break;
    }
    return false;
}
