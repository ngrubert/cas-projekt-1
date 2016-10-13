var notestemplate = document.getElementById("notes-template");
if (notestemplate) {
    var createNotesTemplate = Handlebars.compile(notestemplate.innerText);
    // provide helper function to format date; requires moment.js library
    Handlebars.registerHelper('formatDate', function (date, format) {
        var mmnt = moment(date);
        return mmnt.format(format);
    });
}

function initDummyNotes() {
    /* create some dummy records to start
       'due_date' is the deadline when the task should be finished
       'finish_date' is the date when the user has ticked the 'Finished' checkbox
       due_date and created_date are set to future dates using the moment JS library
    */
    var today = new Date(),
        dummy_notes = [
           {"id":1,
            "due_date":new moment(today, "YYYY-MM-DD").add(3, 'days'),
            "created_date":new moment(today, "YYYY-MM-DD").add(1, 'days'),
            "title":"Einkaufen",
            "description":"Obst, Gemüse, Poulet",
            "is_finished":true,
            "importance":4},
           {"id":2,
            "due_date":new moment(today, "YYYY-MM-DD").add(4, 'days'),
            "created_date":new moment(today, "YYYY-MM-DD").add(2, 'days'),
            "title":"Auto waschen",
            "description":"Unterbodenwäsche nicht vergessen.",
            "is_finished":false,
            "importance":1},
           {"id":3,
            "due_date":new moment(today, "YYYY-MM-DD").add(5, 'days'),
            "created_date":new moment(today, "YYYY-MM-DD").add(3, 'days'),
            "title":"Spanisch Kurs am Abend besuchen",
            "description":"Lektion von letzter Woche nochmal durchgehen.",
            "is_finished":false,
            "importance":2},
           {"id":4,
            "due_date":new moment(today, "YYYY-MM-DD").add(1, 'days'),
            "created_date":new moment(today, "YYYY-MM-DD").add(4, 'days'),
            "title":"Blumen giessen",
            "description":"Drachenbaum dieses Mal kein Wasser geben.",
            "is_finished":false,
            "importance":3},
           {"id":5,
            "due_date":new moment(today, "YYYY-MM-DD").add(8, 'days'),
            "created_date":new moment(today, "YYYY-MM-DD").add(5, 'days'),
            "title":"Mit der Katze zum Tierarzt fahren",
            "description":"Impfpass mitnehmen und Medikamente vom Tierarzt mitnehmen.",
            "is_finished":false,
            "importance":5}
    ];
    // create dummy entries
    for (var i = 0, l = dummy_notes.length; i < l; i++) {
        var obj = dummy_notes[i];
        saveNote(obj.title, obj.description, obj.created_date, obj.due_date, obj.finish_date, obj.is_finished, obj.importance)
    }
    return dummy_notes
}

function saveNote(title, description, created_date, due_date, finish_date, is_finished, importance) {
    notes_str = localStorage.getItem("notesdata");
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
                        }
    notes_list.push(new_note);
    localStorage.setItem("notesdata", JSON.stringify(notes_list));
}

function getNotesData() {
    var notes_str  = localStorage.getItem("notesdata") || JSON.stringify(initDummyNotes()),
        notes_list = JSON.parse(notes_str);
    return notes_list
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

function editNote(id) {
    console.log('Edit note with id = ' + id);
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

// define event handlers
$(function(){
    if (notestemplate) {
        // try to get the sortby from session; if its not set use default ('finish_date')
        var sortby = sessionStorage.getItem('sortby') || 'due_date';
        // save sortby to session
        sessionStorage.setItem('sortby', sortby);
        renderNotes(sortby);
        $('#sortby').on('click', 'button', sortbyEventHandler);
        $('#toggle-finished').on('click', 'button', filterFinished);
    };

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
            saveNote(title, description, null, due_date, null, false, importance)
            window.location.replace('index.html');
        } else {
            // validation failed
            // just stay at form and show HTML5 validation messages for input fields
        }
    });


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
