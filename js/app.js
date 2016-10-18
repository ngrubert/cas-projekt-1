var notestemplate = document.getElementById("notes-template");
// I find this more readable than JQuery statement: if ( $('#notes-template').length) )
if (notestemplate) {
    var createNotesTemplate = Handlebars.compile(notestemplate.innerText);
    // provide helper function to format date; requires moment.js library
    Handlebars.registerHelper('formatDate', function (date, format) {
        var mmnt = moment(date);
        return mmnt.format(format);
    });
}

function initDummyNotes() {
    /**
     * create some dummy records to start
     * 'due_date' is the deadline when the task should be finished
     * 'finish_date' is the date when the user has ticked the 'Finished' checkbox
     * due_date and created_date are set to future dates using the moment JS library
     */
    var today = new Date(),
        dummy_notes = [
           {
               "id":1,
                "due_date":new moment(today, "YYYY-MM-DD").add(3, 'days'),
                "created_date":new moment(today, "YYYY-MM-DD").add(1, 'days'),
                "title":"Einkaufen",
                "description":"Obst, Gemüse, Poulet, Mineralwasser",
                "is_finished":true,
                "importance":4
           },
           {
                "id":2,
                "due_date":new moment(today, "YYYY-MM-DD").add(4, 'days'),
                "created_date":new moment(today, "YYYY-MM-DD").add(2, 'days'),
                "title":"Auto waschen",
                "description":"Unterbodenwäsche nicht vergessen.",
                "is_finished":false,
                "importance":1
           },
           {
                "id":3,
                "due_date":new moment(today, "YYYY-MM-DD").add(8, 'days'),
                "created_date":new moment(today, "YYYY-MM-DD").add(3, 'days'),
                "title":"Mit der Katze zum Tierarzt fahren",
                "description":"Impfpass mitnehmen und Medikamente beim Tierarzt kaufen.",
                "is_finished":false,
                "importance":5
           },
           {
                "id":4,
                "due_date":new moment(today, "YYYY-MM-DD").add(1, 'days'),
                "created_date":new moment(today, "YYYY-MM-DD").add(4, 'days'),
                "title":"Blumen giessen",
                "description":"Dem Drachenbaum und Kaktus dieses Mal kein Wasser geben.",
                "is_finished":false,
                "importance":3
           },
            {
                 "id":5,
                 "due_date":new moment(today, "YYYY-MM-DD").add(5, 'days'),
                 "created_date":new moment(today, "YYYY-MM-DD").add(5, 'days'),
                 "title":"Spanisch Kurs am Abend besuchen",
                 "description":"Lektion von letzter Woche nochmal durchgehen.",
                 "is_finished":false,
                 "importance":2
            }
    ];
    // create dummy entries
    for (var i = 0, l = dummy_notes.length; i < l; i++) {
        var obj = dummy_notes[i];
        saveNote(obj.title, obj.description, obj.created_date, obj.due_date, obj.finish_date, obj.is_finished, obj.importance)
    }
    return dummy_notes
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

function saveNote(title, description, created_date, due_date, finish_date, is_finished, importance) {
    var notes_str = localStorage.getItem("notesdata");
    if ( !notes_str ) {
        // if there is no notesdata saved then init it
        localStorage.setItem("notesdata", JSON.stringify([]));
        var notes_str = localStorage.getItem("notesdata"),
            new_id = 1;
    }
    var notes_list  = JSON.parse(notes_str),
        maxid       = Math.max.apply(Math, notes_list.map(function(obj){return obj.id;})),
        newid       = new_id || maxid + 1,
        new_note    =  {'id': newid,
                        'title': title,
                        'description': description,
                        'created_date': created_date || new Date(),
                        'due_date': due_date,
                        'finish_date': finish_date,
                        'is_finished': is_finished,
                        'importance': importance
                        };
    notes_list.push(new_note);
    localStorage.setItem("notesdata", JSON.stringify(notes_list));
}

function updateNote(id, title, description, created_date, due_date, finish_date, is_finished, importance) {
    var notes_str = localStorage.getItem("notesdata"),
        notes_list  = JSON.parse(notes_str),
        note = {'id': Number(id),
                'title': title,
                'description': description,
                'created_date': created_date || new Date(),
                'due_date': due_date,
                'finish_date': finish_date,
                'is_finished': is_finished,
                'importance': importance
                };
    for (var i = 0; i < notes_list.length; i++) {
        if(Number(id) === Number(notes_list[i].id)){
            notes_list[i] = note;
            break;
        }

    }
    localStorage.setItem("notesdata", JSON.stringify(notes_list));
}


function getNotesData() {
    var notes_str  = localStorage.getItem("notesdata") || JSON.stringify(initDummyNotes());
    return JSON.parse(notes_str);
}

function getNoteById(id) {
    var id = Number(id),
        notes = getNotesData();
    for (var i = 0; i < notes.length; i++) {
        if(id === notes[i].id){
            return notes[i];
        }
    }
}

function renderNotes(sortby) {
    var notes = getNotesData();
    if (!sortby) {
        var sortby = sessionStorage.getItem('sortby');
    }
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
        var filtered_notes = notes.filter( obj => obj.is_finished == false);
    } else {
        // show all notes including finished ones
        var filtered_notes = notes;
    };
    // render template and pass the filtered_notes which is sorted with sortfunc alias
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

function updateNoteFinishedStatus(id) {
    var notes  = getNotesData(),
        cb     = $('#finished-'+id),
        status = cb.is(':checked');
    for (var i = 0; i < notes.length; i++) {
        if ( parseInt(id) === notes[i].id ) {
            notes[i].is_finished = status;
            notes[i].finish_date = new Date(); // update finish date
            break;  // exit loop since we found the note which needs to be updated
        }
    }
    // put the modified notesdata as string back to localStorage
    localStorage.setItem("notesdata", JSON.stringify(notes));
    renderNotes();
}

function editNote(note_id) {
    console.log("Edit Note Id: " + note_id);
    sessionStorage.setItem('NoteIdToEdit', note_id);
    if (note_id) {
        window.location.assign("editNote.html?id=" + note_id);
    }
}

$(function(){

    loadStylesheet();

    if (notestemplate) {
        // try to get the sortby from session; if its not set use default ('due_date')
        var sortby = sessionStorage.getItem('sortby') || 'due_date';
        // save sortby to session
        sessionStorage.setItem('sortby', sortby);
        renderNotes(sortby);
        $('#sortby').on('click', 'button', sortbyEventHandler);
        $('#toggle-finished').on('click', 'button', filterFinished);
    }

    /* -------------------------------------------------------
     Event handlers
     --------------------------------------------------------
     */

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
            saveNote(title, description, null, due_date, null, false, importance);
            window.location.replace('index.html');
        } else {
            // validation failed
            // just stay at form and show HTML5 validation messages for input fields
        }
    });

    /* $('.edit-button').click(function(event) {
        var note_id = event.target.getAttribute('data-id');
        console.log("Edit Note Id: " + note_id);
        sessionStorage.setItem('NoteIdToEdit', note_id);
        if (note_id) {
            var x = note_id;
            // window.location.assign("editNote.html?id=" + note_id);
        }
    }); */

    $('#stylesheet-selector').on('change', changeStylesheet);

    // listen to the "Finished" checkboxes and update note according to checkbox status
    /* DOES NOT work anymore after is has been run once - don't know why
    $('input:checkbox').click(function() {
            var cb = $(this);
            updateNoteFinishedStatus(cb.val())
            console.log('Setting Note with id ' + cb.val() + ' to finished = ' + cb.is(':checked'))
            renderNotes();
        });
     */
});
