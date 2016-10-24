function setupHandlebars() {
    // provide helper function to format date; requires moment.js library
    Handlebars.registerHelper('formatDueDate', function (date, format) {
        var m_date = moment(date),
            today = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}), // set 00:00:00 since m_date is 00:00:000 too so we have correct m_date.diff value
            days_diff = m_date.diff(today, 'days');
        if (days_diff == 0) {
            return 'Today'
        }
        else if (days_diff == 1) {
            return 'Tomorrow'
        }
        else if (days_diff < 0) {
            return new Handlebars.SafeString('<span class="hurry">Hurry up! (' + days_diff + ' days)</span>')
        }
        return m_date.format(format) + ' (' + days_diff + ' days remaining)'
    });
    Handlebars.registerHelper('formatDate', function (date, format) {
        var mmnt = moment(date);
        return mmnt.format(format)
    });
}

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


function changeStylesheet() {
    var selectedStylesheet = $('#stylesheet-selector').val();
    localStorage.setItem('cssName', selectedStylesheet);
    $('#css-style').attr("href", 'css/' + selectedStylesheet + '.css');
}

function loadStylesheet() {
    var currentStylesheet = localStorage.getItem('cssName');
    if (!currentStylesheet) {
        localStorage.setItem('cssName', 'default');
    }
    var currentStylesheet = localStorage.getItem('cssName');
    $('#css-style').attr('href', 'css/' + currentStylesheet + '.css');
    $('#stylesheet-selector').val(currentStylesheet).change();
}

function renderNotes(sortby) {
    setupHandlebars();
    // take passed sortby or try to get the sortby from session; if its not set use default ('due_date')
    var sortby = sortby || sessionStorage.getItem('sortby') || 'due_date';
    // save sortby to session
    sessionStorage.setItem('sortby', sortby);
    var notes = NSNotes.Storage.getNotesData();

    // set all active buttons inactive
    $('#sortby').find('.btn-active').removeClass('btn-active')
        .addClass('btn-inactive');
    // activate the clicked button
    $('#'+sortby).removeClass('btn-inactive').addClass('btn-active');
    // create generic sort function
    var sortfunc = function(n1,n2) { return n1[sortby] < n2[sortby] };
    // filter notes list according to [Show finished] button
    if (!$('#show-finished-btn').hasClass('btn-active')) {
        // show only notes which are not finished
        var filtered_notes = notes.filter(obj => obj.is_finished == false);
    } else {
        // show all notes including finished ones
        var filtered_notes = notes;
    };
    // render template and pass the filtered_notes which is sorted with sortfunc alias
    var notestemplate = document.getElementById("notes-template"),
        createNotesTemplate = Handlebars.compile(notestemplate.innerText);
    $("#notes-container").html(createNotesTemplate(filtered_notes.sort(sortfunc)));
}

function sortbyEventHandler(event) {
    var sortby = event.target.getAttribute('data-sortby');
    // update sortby in session
    sessionStorage.setItem('sortby', sortby);
    renderNotes(sortby);
}

function filterFinished() {
    $('#show-finished-btn').toggleClass('btn-inactive btn-active');
    renderNotes();
}

function editNote(note_id) {
    sessionStorage.setItem('NoteIdToEdit', note_id);
    if (note_id) {
        window.location.assign("editNote.html?id=" + note_id);
    }
}


$(function() {
    // run when DOM is loaded
    loadStylesheet();
    renderNotes();

    /* -------------------------------------------------------
     Event handlers
     --------------------------------------------------------
     */
    $('#sortby').click(sortbyEventHandler);
    $('#toggle-finished').click(filterFinished);
    $('#stylesheet-selector').on('change', changeStylesheet);
    $('.note-date input:checkbox').click(function() {
        var cb = $(this),
            status = cb.is(':checked');
        NSNotes.Storage.updateNoteFinishedStatus(cb.val(), status);
        renderNotes();
    })
    $('#notes-container').on('click', '.edit-button', function() {
            var note_id = event.target.getAttribute('data-id');
            sessionStorage.setItem('NoteIdToEdit', note_id);
            if (note_id) {
                window.location.assign("editNote.html");
            }
    })

    //$('input:checkbox').click(function() {
});
