var express = require('express');
var router = express.Router();
var notes = require('../controller/notesController.js');

// UI
router.get('/', notes.showIndex);                         // list entries
router.get('/notes', notes.showIndex);                    // list entries
router.get('/notes/:id', notes.viewNote);                 // view single entry
router.get('/addNoteForm', notes.addNoteForm);            // add note form
router.post('/addNoteForm/', notes.addNote);              // add entry
router.get('/notes/:id/edit', notes.editNoteForm);        // edit note form
router.put('/notes/:id/edit', notes.updateNote);          // update entry
router.get('/notes/:id/delete', notes.deleteNoteForm);    // delete note form
router.delete('/notes/:id/delete', notes.deleteNote);       // delete entry
router.get('/createDummyNotes', notes.createDummyNotes);  // create some dummy notes entries
router.get('/notes/:id/updateFinishedStatus', notes.updateNoteFinishedStatus);    // update entry

// REST API
router.get('/api', notes.notesData);
router.post('/api', notes.notesDataFiltered);

module.exports = router;
