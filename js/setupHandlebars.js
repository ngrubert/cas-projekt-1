'use strict';
(function(NSNotes) {
    NSNotes.HandlebarHelpers = (function() {

        function _setHelpers() {
            // provide helper function to format date; requires moment.js library
            Handlebars.registerHelper('formatDueDate', function (date, format) {
                var m_date = moment(date),
                    today = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}), // set 00:00:00 since m_date is 00:00:000 too so we have correct m_date.diff value
                    days_diff = m_date.diff(today, 'days');
                if (days_diff == 0) {
                    return 'Today'
                }
                else if (days_diff == 1) {
                    return 'Tomorrow'
                }
                else if (days_diff < 0) {
                    return new Handlebars.SafeString('<span class="hurry">Hurry up! (' + days_diff + ' days)</span>')
                }
                return m_date.format(format) + ' (' + days_diff + ' days remaining)'
            });
            Handlebars.registerHelper('formatDate', function (date, format) {
                var mmnt = moment(date);
                return mmnt.format(format)
            });
        }

        return {
            setHelpers: _setHelpers
        };

    })();
}(window.NSNotes = window.NSNotes || {}));