"use strict";

/* -------------------------------------------------------------------
 *    Import modules
 * ------------------------------------------------------------------- */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');
var moment = require('moment');
var routes = require('./routes/notesRoutes');

// Create the express web framework
var app = express();

// view engine setup
app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


/* -------------------------------------------------------------------
 *    Setup the middleware:
 * ------------------------------------------------------------------- */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("method-override")(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* -------------------------------------------------------------------
 *    Register some handlebars helper methods
 * ------------------------------------------------------------------- */

// format the dueDate according to time delta
hbs.registerHelper('formatDueDate', function (date, format) {
  var m_date = moment(date),
      today = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}), // set 00:00:00 since m_date is 00:00:000 too so we have correct m_date.diff value
      days_diff = m_date.diff(today, 'days');
  if (days_diff == 0) {
    return 'Today';
  }
  else if (days_diff == 1) {
    return 'Tomorrow';
  }
  else if (days_diff < 0) {
    return new Handlebars.SafeString('<span class="hurry">Hurry up! (' + days_diff + ' days)</span>');
  }
  return m_date.format(format) + ' (' + days_diff + ' days remaining)';
});

// format a date to a given format using the moment JS lib
hbs.registerHelper('formatDate', function (date, format) {
  var mmnt = moment(date);
  return mmnt.format(format);
});

// check if 2 values are equal
hbs.registerHelper('isEqual', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

module.exports = app;

// start the server
const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, function() {  console.log('Server running at http://' + hostname + ':' + port); });