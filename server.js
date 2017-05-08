var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose  = require('mongoose');

var cors = require('cors');

var public = require('./server/routes/public');
// var users = require('./routes/users');
var config = require('./server/config/config');
var alerts = require('./server/routes/feeds');
var refer = require('./server/routes/reference');

var authController = require('./server/middlewares/auth/auth');

var app = express(); 

if(process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.database_dev_uri);
}
else{
  mongoose.connect(config.database_test_uri);
}

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/dist')));
app.use(cors());

// app.use('/api', public);
// app.use('/users', users);
app.use('/api', public);
app.use('/api/alerts',authController.authorize,alerts);
app.use('/api/reference',authController.authorize,refer);

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.send(err);
});

module.exports = app;
