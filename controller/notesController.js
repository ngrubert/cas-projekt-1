"use strict";

var notesStorageService = require("../services/notesStorageService"),
    dummyNotes          = require('../public/javascripts/dummynotes');


// Thanks to ECMAScript 6 we finally are able to use 'class' instead of 'function' statement
// including the possibility to provide default values in the constructor (similiar to Python)
class Note {
    constructor(title, description = '', createdDate, dueDate, finishDate, isFinished, importance = 1) {
        this.title = title;
        this.description = description;
        this.createdDate = createdDate ? new Date(createdDate) : new Date();
        this.dueDate = new Date(dueDate);
        this.finishDate = finishDate ? new Date(finishDate) : null;
        this.isFinished = isFinished ? true : false;
        this.importance = importance;
    }
}

module.exports.showIndex = function(req, res, next) {
    res.render("index");
};

module.exports.viewNote = function(req, res, next) {
    notesStorageService.getNote(req.params.id, function(err, note) {
        res.render("viewNote", note);
    });
};

module.exports.addNoteForm = function(req, res, next) {
    res.render("addNoteForm");
};

module.exports.editNoteForm = function(req, res, next) {
    notesStorageService.getNote(req.params.id, function(err, note) {
        res.render("editNoteForm", note);
    });
};

module.exports.deleteNoteForm = function(req, res, next) {
    notesStorageService.getNote(req.params.id, function(err, note) {
        res.render("deleteNoteForm", note);
    });
};

module.exports.notesData = function(req, res, next) {
    notesStorageService.getNotes(function(err, notes) {
        res.json(notes);
    });
};

module.exports.notesDataFiltered = function(req, res, next) {
    notesStorageService.getNotesFiltered(req.body.sortBy, req.body.sortOrder, req.body.showFinished, function(err, notes) {
        res.render("notesListing", {"noteslist" : notes});
    });
};

module.exports.renderNotes = function(req, res, next) {
    res.render("notesListing", {"noteslist" : JSON.parse(req.body.data)} );
};

module.exports.addNote = function(req, res, next) {
    var note = new Note(req.body.title, req.body.description, null, req.body.dueDate, null, null, req.body.importance);
    notesStorageService.addNote(note);
    res.redirect("/")
};

module.exports.updateNote = function(req, res, next) {
    notesStorageService.getNote(req.params.id, function(err, note) {
        note.title = req.body.title;
        note.description = req.body.description;
        note.dueDate = req.body.dueDate;
        note.importance = req.body.importance;
        note.isFinished = req.body.isFinished  ? true : false;
        if (note.isFinished) {
            note.finishDate = new Date();
        }
        notesStorageService.updateNote(note);
    });
    res.redirect("/")
};

module.exports.updateNoteFinishedStatus = function(req, res, next) {
    notesStorageService.getNote(req.params.id, function(err, note) {
        if (note.isFinished) {
            // turn finished note to an unfinished one
            note.isFinished = false;
            note.finishDate = null;
        } else {
            // turn unfinished note to a finished one
            note.isFinished = true;
            note.finishDate = new Date();
        }
        notesStorageService.updateNote(note);
    });
    res.redirect("/")

};

module.exports.deleteNote = function(req, res){
    notesStorageService.deleteNote(req.params.id, function(err) {
        res.redirect("/")
    });
};

function createDummyNotes() {
    // create some dummy records to start
    for (var i = 0, l = dummyNotes.length; i < l; i++) {
        var obj = dummyNotes[i];
        var note = new Note(obj.title, obj.description, obj.createdDate, obj.dueDate, obj.finishDate, obj.isFinished, obj.importance);
        notesStorageService.addNote(note);
    }
}

module.exports.createDummyNotes = function(req, res) {
    createDummyNotes();
    res.redirect("/")
};
