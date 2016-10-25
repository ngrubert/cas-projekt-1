'use strict';

function initDefaultNotes() {
    /**
     * create some dummy records to start
     * 'default_notes' is defined in defaultnotes.js
     */
    for (var i = 0, l = default_notes.length; i < l; i++) {
        var obj = default_notes[i];
        NSNotes.Storage.saveNote(obj.title, obj.description, obj.created_date, obj.due_date, obj.finish_date, obj.is_finished, obj.importance)
    }
    return default_notes
}

function renderNotes(sortby) {
    // take passed sortby or try to get the sortby from session; if its not set use default ('due_date')
    var sortby = sortby || sessionStorage.getItem('sortby') || 'due_date',
        sortorder = sortorder || sessionStorage.getItem('sortorder') || 'asc';
    // save sortby to session
    sessionStorage.setItem('sortby', sortby);
    sessionStorage.setItem('sortorder', sortorder);
    var notes = NSNotes.Storage.getNotesData();
    // set all active buttons inactive
    $('#sortby').find('.btn-active')
                .removeClass('btn-active')
                .addClass('btn-inactive');
    // activate the clicked button
    $('#'+sortby).removeClass('btn-inactive')
                 .addClass('btn-active');
    // create generic sort function
    var sortfunc = function(n1,n2) {
        if (sortorder == 'asc') {
            return n1[sortby] > n2[sortby]
        }
        else {
            return n1[sortby] < n2[sortby]
        }
    }
    // filter notes list according to [Show finished] button
    if (!$('#btn-show-finished').hasClass('btn-active')) {
        // show only notes which are not finished
        var filtered_notes = notes.filter(obj => obj.is_finished == false);
    } else {
        // show all notes including finished ones
        var filtered_notes = notes;
    }
    // render template and pass filtered_notes which is sorted with sortfunc alias
    var notestemplate = $('#notes-template'),
        create_notes_template = Handlebars.compile(notestemplate.text());
    $("#notes-container").html(create_notes_template(filtered_notes.sort(sortfunc)));
}


$(function() {
    // run when DOM is loaded
    NSNotes.Stylesheet.loadStylesheet();
    NSNotes.HandlebarHelpers.setHelpers();
    renderNotes();

    /* -------------------------------------------------------
     Event handlers
     --------------------------------------------------------
     */

    $('#add-new-note').click(function() {
        window.location.assign("addNote.html");
    })

    $('#sortby').on('click', '.btn', function(event) {
        var sortby = event.target.getAttribute('data-sortby');
        sessionStorage.setItem('sortby', sortby);
        renderNotes();
    })

    $('#btn-sortorder').click(function() {
        var sortorder = sessionStorage.getItem('sortorder'),
            btn_sortorder = $('#btn-sortorder');
        if (sortorder === 'asc') {
            sessionStorage.setItem('sortorder', 'desc');
            btn_sortorder.text('Desc');
        }
        else if (sortorder === 'desc') {
            sessionStorage.setItem('sortorder', 'asc');
            btn_sortorder.text('Asc');
        }
        renderNotes();
    })

    $('#btn-show-finished').click(function() {
        $('#btn-show-finished').toggleClass('btn-inactive btn-active');
        renderNotes();
    })

    $('#stylesheet-selector').on('change', function() {
        var selectedStylesheet = $('#stylesheet-selector').val();
        sessionStorage.setItem('cssname', selectedStylesheet);
        $('#css-style').attr("href", 'css/' + selectedStylesheet + '.css');
    })

    var notes_container = $('#notes-container');

    notes_container.on('click', '.chk-finished', function() {
        var cb = $(this),
            status = cb.is(':checked');
        NSNotes.Storage.updateNoteFinishedStatus(cb.val(), status);
        renderNotes();
    })

    notes_container.on('click', '.edit-button', function() {
        var note_id = event.target.getAttribute('data-id');
        sessionStorage.setItem('NoteIdToEdit', note_id);
        if (note_id) {
            window.location.assign("editNote.html");
        }
    })

});
