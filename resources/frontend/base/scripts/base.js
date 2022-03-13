$(document).ready(function () {
    $('.toOverlay').click(function(e) {
        e.preventDefault();
        let uri = "http://localhost:3000" + $(this).attr("href");

        $('#overlay_iframe').attr("src", uri);
        $('#overlayIFrame').show();
        return false;
    })

    $('#overlayIFrameContentHeaderClose').click(function(e) {
        e.preventDefault();
        $('#overlayIFrame').hide();
        return false;
    })
});

function setDataTable(id) {
    // Setup - add a text input to each footer cell
    $('#' + id + ' thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#' + id + ' thead');

    let table = $('#' + id).DataTable({
        orderCellsTop: true,
        fixedHeader: true,
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
                    //$(cell).html('<input type="text" placeholder="' + title + '" />');
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
            "info": "_START_ bis _END_ von _TOTAL_ Einträgen",
            "infoEmpty": "Keine Daten vorhanden",
            "infoFiltered": "(gefiltert von _MAX_ Einträgen)",
            "infoThousands": ".",
            "loadingRecords": "Wird geladen ..",
            "processing": "Bitte warten ..",
            "paginate": {
                "first": "Erste",
                "previous": "Zurück",
                "next": "Nächste",
                "last": "Letzte"
            },
            "aria": {
                "sortAscending": ": aktivieren, um Spalte aufsteigend zu sortieren",
                "sortDescending": ": aktivieren, um Spalte absteigend zu sortieren"
            },
            "select": {
                "rows": {
                    "_": "%d Zeilen ausgewählt",
                    "1": "1 Zeile ausgewählt"
                },
                "cells": {
                    "1": "1 Zelle ausgewählt",
                    "_": "%d Zellen ausgewählt"
                },
                "columns": {
                    "1": "1 Spalte ausgewählt",
                    "_": "%d Spalten ausgewählt"
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
                "copyKeys": "Drücken Sie die Taste <i>ctrl<\/i> oder <i>⌘<\/i> + <i>C<\/i> um die Tabelle<br \/>in den Zwischenspeicher zu kopieren.<br \/><br \/>Um den Vorgang abzubrechen, klicken Sie die Nachricht an oder drücken Sie auf Escape.",
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
                "fill": "Alle Zellen mit <i>%d<i> füllen<\/i><\/i>",
                "fillHorizontal": "Alle horizontalen Zellen füllen",
                "fillVertical": "Alle vertikalen Zellen füllen"
            },
            "decimal": ",",
            "search": "Suche:",
            "searchBuilder": {
                "add": "Bedingung hinzufügen",
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
                        "gt": "Größer als",
                        "gte": "Größer als oder gleich",
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
                        "notContains": "enthält nicht",
                        "notStarts": "startet nicht mit",
                        "notEnds": "endet nicht mit"
                    },
                    "array": {
                        "equals": "ist gleich",
                        "empty": "ist leer",
                        "contains": "enthält",
                        "not": "ist ungleich",
                        "notEmpty": "ist nicht leer",
                        "without": "aber nicht"
                    }
                },
                "data": "Daten",
                "deleteTitle": "Filterregel entfernen",
                "leftTitle": "Äußere Kriterien",
                "logicAnd": "UND",
                "logicOr": "ODER",
                "rightTitle": "Innere Kriterien",
                "title": {
                    "0": "Such-Baukasten",
                    "_": "Such-Baukasten (%d)"
                },
                "value": "Wert",
                "clearAll": "Alle löschen"
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
            "zeroRecords": "Keine passenden Einträge gefunden",
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
                    "März",
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
                "close": "Schließen",
                "create": {
                    "button": "Neu",
                    "title": "Neuen Eintrag erstellen",
                    "submit": "Neu"
                },
                "edit": {
                    "button": "Ändern",
                    "title": "Eintrag ändern",
                    "submit": "ändern"
                },
                "remove": {
                    "button": "Löschen",
                    "title": "Löschen",
                    "submit": "Löschen",
                    "confirm": {
                        "_": "Sollen %d Zeilen gelöscht werden?",
                        "1": "Soll diese Zeile gelöscht werden?"
                    }
                },
                "error": {
                    "system": "Ein Systemfehler ist aufgetreten"
                },
                "multi": {
                    "title": "Mehrere Werte",
                    "info": "Die ausgewählten Elemente enthalten mehrere Werte für dieses Feld. Um alle Elemente für dieses Feld zu bearbeiten und auf denselben Wert zu setzen, klicken oder tippen Sie hier, andernfalls behalten diese ihre individuellen Werte bei.",
                    "restore": "Änderungen zurücksetzen",
                    "noMulti": "Dieses Feld kann nur einzeln bearbeitet werden, nicht als Teil einer Mengen-Änderung."
                }
            }
        }
    });
}

function dataTable_Add(id) {
    let template = $('#' + id + '_addRow').html();
    $('#' + id + " tbody").append(template);
    console.log(template);
}


function addAutoComplete(fieldID, filter) {
    $( fieldID ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "/backend/autocomplete/" + filter + "/" + request.term,
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
            $(fieldID).val(ui.item.value);
        },
        open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });

}