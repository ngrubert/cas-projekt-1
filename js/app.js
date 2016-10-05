var notestemplate = document.getElementById("notes-template");
if (notestemplate) {
    var createNotesTemplate = Handlebars.compile(notestemplate.innerText);
    // provide helper function to format date; requires moment.js library
    Handlebars.registerHelper('formatDate', function (date, format) {
        var mmnt = moment(date);
        return mmnt.format(format);
    });
}

function getNotesData() {
    var notes_str  = localStorage.getItem("notesdata") || "[]",
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
        var filtered_notes = notes.filter( obj => obj.is_finished == false;)
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



// define event handlers
$(function(){
    if (notestemplate) {
        // try to get the sortby from session; if its not set use default ('finish_date')
        var sortby = sessionStorage.getItem('sortby') || 'finish_date';
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
            finish_date = $('#field-finish_date').val(),
            importance  = $("input:radio[name ='importance']:checked").val(),
            notes_str   = localStorage.getItem("notesdata");
        if ( !notes_str ) {
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
                           'finish_date':finish_date,
                           'importance':importance,
                           'created_date':new Date(),
                           'is_finished': false
                           }
        notes_list.push(new_note);
        localStorage.setItem("notesdata", JSON.stringify(notes_list));

        window.location.replace('index.html');

    });
});
