(function(NSNotes, $) {
    'use strict';

    $(function() {

        renderNotes();

        /* -------------------------------------------------------
         Event handlers
         --------------------------------------------------------
         */

        $('#add-new-note').click(function() {
            window.location.assign("/addNoteForm");
        });

        $('#sortby').on('click', '.inactive', function(event) {
            var sortby = event.target.getAttribute('data-sortby');
            sessionStorage.setItem('sortby', sortby);
            renderNotes();
        });

        $('#btn-sortorder').click(function() {
            var sortorder = sessionStorage.getItem('sortorder');
            if (!sortorder || sortorder === '1') {
                sessionStorage.setItem('sortorder', '-1');
            }
            else if (sortorder === '-1') {
                sessionStorage.setItem('sortorder', '1');
            }
            renderNotes();
        });

        $('#btn-show-finished').click(function() {
            $('#btn-show-finished').toggleClass('inactive active');
            if (!$('#btn-show-finished').hasClass('active')) {
                sessionStorage.setItem('showfinished', "");
            } else {
                sessionStorage.setItem('showfinished', true);
            }
            renderNotes();
        });

        var mainContainer = $('#maincontent');
        mainContainer.on('click', '.chk-finished', function() {
            var cb = $(this),
                status = cb.is(':checked'),
                noteId = cb.val();
            window.location.assign("/notes/" + noteId + "/updateFinishedStatus");
            renderNotes();
        });

        mainContainer.on('click', '.view-button', function() {
            var noteId = event.target.getAttribute('data-id');
            if (noteId) {
                window.location.assign("/notes/" + noteId);
            }
        });

        mainContainer.on('click', '.edit-button', function() {
            var noteId = event.target.getAttribute('data-id');
            if (noteId) {
                window.location.assign("/notes/" + noteId + "/edit");
            }
        });

        mainContainer.on('click', '.delete', function() {
            var noteId = event.target.getAttribute('data-id');
            if (noteId) {
                window.location.assign("/notes/" + noteId + "/delete");
            }
        });

        function renderNotes(sortby) {

            // take passed sortby or try to get the sortby from session; if its not set use default ('dueDate')
            var sortby = sortby || sessionStorage.getItem('sortby') || 'dueDate',
                sortorder = sessionStorage.getItem('sortorder') || '-1',
                showfinished = sessionStorage.getItem('showfinished') || "";
            // save sorting parameters to session
            sessionStorage.setItem('sortby', sortby);
            sessionStorage.setItem('sortorder', sortorder);
            sessionStorage.setItem('showfinished', showfinished);

            NSNotes.sortBy = sortby;
            NSNotes.sortOrder = sortorder;
            NSNotes.showFinished = showfinished;

            // set all active buttons inactive
            $('#sortby').find('.active')
                        .removeClass('active')
                        .addClass('inactive');
            // activate the clicked button
            $('#'+sortby).removeClass('inactive')
                         .addClass('active');

            // setup the Asc/Desc button
            var btn_sortorder = $('#btn-sortorder');
            if (NSNotes.sortOrder === '1') {
                btn_sortorder.text('Asc');
            }
            else if (sortorder === '-1') {
                btn_sortorder.text('Desc');
            }

            // setup the Finished button
            if (NSNotes.showFinished) {
                $('#btn-show-finished').removeClass('inactive')
                                       .addClass('active');
            } else {
                $('#btn-show-finished').removeClass('active')
                                       .addClass('inactive');
            }

            $.post( "/api",{sortBy: NSNotes.sortBy, sortOrder: NSNotes.sortOrder, showFinished: NSNotes.showFinished}).done(function( data ) {
                $("main").html(data);
            });
        }

    });
}(window.NSNotes = window.NSNotes || {}, jQuery));