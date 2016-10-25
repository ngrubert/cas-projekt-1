'use strict';

/**
 * Created by nico grubert on 20.10.16.
 */

NSNotes.Stylesheet.loadStylesheet();

$('#cancel-btn').click(function() {
    window.location.replace('index.html');
});

$('#add-btn').click(function() {
    var title       = $('#field-title').val(),
        description = $('#field-description').val(),
        due_date    = $('#field-due_date').val(),
        importance  = $("input:radio[name ='importance']:checked").val();

    // validation is already done with HTML5 but just in case someone tries to hack the form
    if (title && moment(due_date, ["YYYY-MM-DD"], true).isValid()) {
        // validation successfull
        NSNotes.Storage.saveNote(title, description, null, due_date, null, false, importance);
        window.location.replace('index.html');
    } else {
        // validation failed
        // just stay at form and show HTML5 validation messages for input fields
    }
});
