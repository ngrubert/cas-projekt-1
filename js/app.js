// create some dummy records to start
var notes = [
    {"id":1, "finish_date":new Date(2016, 8, 2, 14, 30, 0),
        "created_date":new Date(2016, 8, 1, 12, 30, 0),
        "title":"Einkaufen",
        "description":"Obst, Gemuese, Poulet",
        "is_finished":true,
        "importance":1},
    {"id":2, "finish_date":new Date(2016, 8, 5, 15, 30, 0),
        "created_date":new Date(2016, 8, 3, 15, 30, 0),
        "title":"Auto waschen",
        "description":"Unterbodenwaesche nicht vergessen.",
        "is_finished":false,
        "importance":1},
    {"id":3, "finish_date":new Date(2016, 9, 12, 21, 0, 0),
        "created_date":new Date(2016, 9, 5, 18, 0, 0),
        "title":"Spanisch Kurs besuchen",
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
var notestemplate = document.getElementById("notes-template");
if (notestemplate) {
    var createNotesTemplate = Handlebars.compile(notestemplate.innerText);
    // provide helper function to format date; requires moment.js library
    Handlebars.registerHelper('formatDate', function (date, format) {
        var mmnt = moment(date);
        return mmnt.format(format);
    });
}

function renderNotes(sortby) {
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
        console.log('Showing only active notes');
    } else {
        console.log('Showing all notes including finished ones');
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

// define event handlers
$(function(){
    if (notestemplate) {
        // init
        sortby = 'finish_date';
        // save sortby to session
        sessionStorage.setItem('sortby', sortby);
        renderNotes(sortby);
        $('#sortby').on('click', 'button', sortbyEventHandler);
        $('#toggle-finished').on('click', 'button', filterFinished);
    }
    $('#cancel-btn').click(function() {
        console.log('Hit cancel button');
        window.location.replace('index.html');
    })
});
