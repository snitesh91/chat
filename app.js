//Add all required dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require( 'express-session' );
const passport = require('passport');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const config = require('./config/index');

//create app
var app = express();

//add aal routes js
var validate = require('./routes/validate');
var index = require('./routes/index');
var restricted = require('./routes/restricted');


// view engine setup
//app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views/pug'));
app.set('view engine', 'pug');

//connect to mongo db
mongoose.connect(config.mongo.url);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( session( 
  {
    store: new mongoStore({mongooseConnection: mongoose.connection }),
    secret: config.mongo.secret,
    resave: false,
    cookie: { maxAge: 60*60*24*365*10 }, 
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/validate', validate);
app.use('/', index);
app.use('/restricted', restricted);

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
  res.render('error');
});

module.exports = app;
