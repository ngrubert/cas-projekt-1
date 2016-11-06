"use strict";

var Storage = require('nedb');
var db = new Storage({filename: './data/notes.db', autoload: true});

function getAllNotes(callback) {
    db.find({}, function (err, docs) {
        callback(err, docs);
    });
}

function getNoteById(id, callback) {
    db.findOne({ _id: id }, function (err, doc) {
        callback(err, doc);
    });
}

function getAllNotesFiltered(sortBy, sortOrder, showFinished, callback) {
    var sorting = JSON.parse('{\"'+sortBy+'\" : \"' +sortOrder+'\"}');
    if (sortBy && showFinished){
        // get all entries including finished ones and sort them
        db.find({}).sort(sorting).exec(function (err, docs) {
            callback(err, docs);
        });
    } else if (sortBy) {
        // get only entries which are not marked as finished and sort them
        db.find({'isFinished':false}).sort(sorting).exec(function (err, docs) {
            callback(err, docs);
        });
    } else {
        db.find({}, function (err, docs) {
            callback(err, docs);
        });
    }
}

function addNote(note) {
    db.insert(note, function(err, newDoc){
    });
}

function updateNote(note) {
    getNoteById(note._id, function (err, doc) {
        db.update(doc, note, {}, function (err, numReplaced) {
        });
    });
}

function deleteNote(id, callback) {
    db.remove({ _id: id },function (err, numRemoved) {
        callback(err, numRemoved);
    });
}

module.exports = {
    getNotes: getAllNotes,
    getNote: getNoteById,
    getNotesFiltered: getAllNotesFiltered,
    addNote: addNote,
    updateNote: updateNote,
    deleteNote: deleteNote
};