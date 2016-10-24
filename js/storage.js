/**
 * Created by nico grubert on 19.10.16.
 *
 *  Storage module for Notes
 *
 *  Style hints:
 *      - Like in Python, private methods have a leading "_" character
 *      - Namespace is defined as "NSNotes"
 *      - Modul names should start with capitalized letter, here: "LocalStorage"
 */

(function(NSNotes) {
    NSNotes.Storage = (function () {

        function _getNotesData() {
            var notes_str  = localStorage.getItem("notesdata") || JSON.stringify(initDefaultNotes());
            return JSON.parse(notes_str);
        }

        function _getNoteById(id) {

            var id = Number(id),
                notes = _getNotesData();
            return notes.find(each => each.id === id);
        }

        function _saveNote(title, description, created_date, due_date, finish_date, is_finished, importance) {
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

        function _updateNote(id, title, description, created_date, due_date, finish_date, is_finished, importance) {
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

        function _updateNoteFinishedStatus(id, status) {
            var notes = _getNotesData();
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

        return {
            getNotesData: _getNotesData,
            getNoteById: _getNoteById,
            saveNote: _saveNote,
            updateNote: _updateNote,
            updateNoteFinishedStatus: _updateNoteFinishedStatus
        }
    })();
}(window.NSNotes = window.NSNotes || {}));




