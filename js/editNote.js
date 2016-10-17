/**
 * Created by grubert on 14.10.16.
 */
$(function() {

    var note_id = sessionStorage.getItem('NoteIdToEdit'),
        note = getNoteById(note_id);
    //console.log("Edit note " + note.title);
    $('#field-title').attr('value', note.title);
    $('#field-description').text(note.description);
    $('#field-due_date').attr('value', moment(note.due_date).format("YYYY-MM-DD"));
    $('input[name="importance"][value="' + note.importance.toString() + '"]').prop('checked', true);

    $('#edit-btn').click(function() {
        var title       = $('#field-title').val(),
            description = $('#field-description').val(),
            due_date    = $('#field-due_date').val(),
            importance  = $("input:radio[name ='importance']:checked").val();

        // validation is already done with HTML5 but just in case someone tries to hack the form
        if (title && moment(due_date, ["YYYY-MM-DD"], true).isValid()) {
            // validation successfull
            updateNote(note_id, title, description, null, due_date, null, false, importance);
            window.location.replace('index.html');
        } else {
            // validation failed
            // just stay at form and show HTML5 validation messages for input fields
        }
    });

});