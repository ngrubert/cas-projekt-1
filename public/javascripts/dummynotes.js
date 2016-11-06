'use strict';

/**
 * define some dummy records to start
 * "dueDate" is the deadline when the to-do task should be finished
 * "finishDate" is the date when the user has ticked the "Finished" checkbox
 * dueDate and createdDate are set to future dates using the moment JS library
 */

var moment = require('moment');
var today = new Date(),
    dummyNotes = [
        {
            "dueDate":new moment(today, "YYYY-MM-DD"),
            "createdDate":new moment(today, "YYYY-MM-DD").add(1, "days"),
            "title":"Shopping",
            "description":"Fruits, vegetables, milk, potatoes",
            "isFinished":false,
            "importance":"4"
        },
        {
            "dueDate":new moment(today, "YYYY-MM-DD").add(1, "days"),
            "createdDate":new moment(today, "YYYY-MM-DD").add(2, "days"),
            "title":"Buy football tickets",
            "description":"Buy 2 tickets for the upcoming football match",
            "isFinished":false,
            "importance":"1"
        },
        {
            "dueDate":new moment(today, "YYYY-MM-DD").add(8, "days"),
            "createdDate":new moment(today, "YYYY-MM-DD").add(3, "days"),
            "title":"Doctors appointment",
            "description":"Pre-checkup for dive holidays on Bonaire",
            "isFinished":false,
            "importance":"5"
        },
        {
            "dueDate":new moment(today, "YYYY-MM-DD").add(3, "days"),
            "createdDate":new moment(today, "YYYY-MM-DD").add(4, "days"),
            "title":"Cleaning flat",
            "description":"Don't forget to clean the cooler",
            "isFinished":true,
            "finishDate":new moment(today, "YYYY-MM-DD").add(5, "days"),
            "importance":"3"
        },
        {
            "dueDate":new moment(today, "YYYY-MM-DD").add(5, "days"),
            "createdDate":new moment(today, "YYYY-MM-DD").add(5, "days"),
            "title":"Spanish lessons",
            "description":"Repeat chapters from last lesson",
            "isFinished":false,
            "importance":"2"
        }
    ];

module.exports = dummyNotes;