var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let methodOverride = require('method-override')
let session = require('express-session')
const db = require('./database/db.js')



var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var homeRouter = require('./routes/home');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))
app.use(session({
  secret: 'Mensaje secreto', resave: false, // Evita que la sesión se guarde en cada petición
  saveUninitialized: false
}))



app.use('/', loginRouter);
app.use('/register', registerRouter);
app.use('/home', homeRouter);


db.connect((error) => {
  if (error) {
    console.log(error);
  }
  console.log('Conectado a la base de datos :)');
})
//nos conectamos a la bd

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
