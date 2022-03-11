$(document).ready(function () {
    $('.toOverlay').click(function(e) {
        e.preventDefault();
        let uri = "http://localhost:3000" + $(this).attr("href");

        uri = "http://localhost:3000/backend/account";

        $('#overlay_iframe').attr("src", uri);
        $('#overlayIFrame').show();
        return false;
    })
    $('#overlayIFrameHeaderClose').click(function(e) {
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
    });
}