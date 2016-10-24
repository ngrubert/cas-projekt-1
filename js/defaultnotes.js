/**
 * Created by nico grubert on 19.10.16.
 */

/**
 * define some dummy records to start
 * 'due_date' is the deadline when the task should be finished
 * 'finish_date' is the date when the user has ticked the 'Finished' checkbox
 * due_date and created_date are set to future dates using the moment JS library
 */
var today = new Date(),
    default_notes = [
    {
        "id":1,
        "due_date":new moment(today, "YYYY-MM-DD"),
        "created_date":new moment(today, "YYYY-MM-DD").add(1, 'days'),
        "title":"Einkaufen",
        "description":"Obst, Gemüse, Poulet, Mineralwasser",
        "is_finished":false,
        "importance":4
    },
    {
        "id":2,
        "due_date":new moment(today, "YYYY-MM-DD").add(-2, 'days'),
        "created_date":new moment(today, "YYYY-MM-DD").add(2, 'days'),
        "title":"Auto waschen",
        "description":"Unterbodenwäsche nicht vergessen.",
        "is_finished":false,
        "importance":1
    },
    {
        "id":3,
        "due_date":new moment(today, "YYYY-MM-DD").add(8, 'days'),
        "created_date":new moment(today, "YYYY-MM-DD").add(3, 'days'),
        "title":"Mit der Katze zum Tierarzt fahren",
        "description":"Impfpass mitnehmen und Medikamente beim Tierarzt kaufen.",
        "is_finished":false,
        "importance":5
    },
    {
        "id":4,
        "due_date":new moment(today, "YYYY-MM-DD").add(1, 'days'),
        "created_date":new moment(today, "YYYY-MM-DD").add(4, 'days'),
        "title":"Blumen giessen",
        "description":"Dem Drachenbaum und Kaktus dieses Mal kein Wasser geben.",
        "is_finished":true,
        "importance":3
    },
    {
        "id":5,
        "due_date":new moment(today, "YYYY-MM-DD").add(5, 'days'),
        "created_date":new moment(today, "YYYY-MM-DD").add(5, 'days'),
        "title":"Spanisch Kurs am Abend besuchen",
        "description":"Lektion von letzter Woche nochmal durchgehen.",
        "is_finished":false,
        "importance":2
    }
];