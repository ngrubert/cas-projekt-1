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
    // create some dummy records to start
    var dummy_notes = [
        {"id":1, "finish_date":new Date(2016, 8, 2, 14, 30, 0),
            "created_date":new Date(2016, 8, 1, 12, 30, 0),
            "title":"Einkaufen",
            "description":"Obst, Gemüse, Poulet",
            "is_finished":true,
            "importance":1},
        {"id":2, "finish_date":new Date(2016, 8, 5, 15, 30, 0),
            "created_date":new Date(2016, 8, 3, 15, 30, 0),
            "title":"Auto waschen",
            "description":"Unterbodenwäsche nicht vergessen.",
            "is_finished":false,
            "importance":1},
        {"id":3, "finish_date":new Date(2016, 9, 12, 21, 0, 0),
            "created_date":new Date(2016, 9, 5, 18, 0, 0),
            "title":"Spanisch Kurs am Abend besuchen",
            "description":"Lektion von letzter Woche nochmal wiederholen.",
            "is_finished":false,
            "importance":2},
        {"id":4, "finish_date":new Date(2016, 8, 1, 8, 0, 0),
            "created_date":new Date(2016, 8, 3, 7, 45, 0),
            "title":"Blumen giessen",
            "description":"Drachenbaum dieses Mal kein Wasser geben.",
            "is_finished":true,
            "importance":3},
        {"id":5, "finish_date":new Date(2016, 8, 2, 14, 30, 0),
            "created_date":new Date(2016, 8, 2, 11, 0, 0),
            "title":"Mit der Katze zum Tierarzt",
            "description":"Impfpass mitnehmen und Medikamente vom Tierarzt mitnehmen.",
            "is_finished":false,
            "importance":5}
    ];
    return dummy_notes
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
    console.log('Set sortby to session: ' + sortby);
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
        console.log('Hit cancel button');
        window.location.replace('index.html');
    });

    $('#add-btn').click(function() {
        var title       = $('#field-title').val(),
            description = $('#field-description').val(),
            due_date    = $('#field-due_date').val(),
            importance  = $("input:radio[name ='importance']:checked").val(),
            notes_str   = localStorage.getItem("notesdata");
        if (title && moment(due_date)) {
             // validation successfull
            if ( !notes_str ) {
                // if there is no notesdata saved, init it
                localStorage.setItem("notesdata", JSON.stringify([]));
                var notes_str = localStorage.getItem("notesdata"),
                    new_id = 1;
            }
            var notes_list  = JSON.parse(notes_str),
                maxid       = Math.max.apply(Math, notes_list.map(function(obj){return obj.id;})),
                newid       = new_id || maxid + 1,
                new_note    = {'id':newid,
                    'title':title,
                    'description':description,
                    'finish_date':null,
                    'due_date':due_date,
                    'importance':importance,
                    'created_date':new Date(),
                    'is_finished': false
                }
            notes_list.push(new_note);
            localStorage.setItem("notesdata", JSON.stringify(notes_list));
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
