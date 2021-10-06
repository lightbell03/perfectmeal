var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

//var server = require('http').createServer(app);
//var io = require('socket.io')(server);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var receiveImageRouter = require("./routes/receive_image");
var receiveFoodInfoRouter = require("./routes/receive_food_info");
var receiveRaspberryPiRouter = require("./routes/raspberryPi");
var registSerialNumberRouter = require("./routes/regist_serial_number");
var getUserNutrianInfoRouter = require("./routes/get_user_nutrian_info");

const con = require('./routes/sqlcon');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '15mb' }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/receive_image', receiveImageRouter);
app.use('/receive_food_info', receiveFoodInfoRouter);
app.use('/raspberryPi', receiveRaspberryPiRouter);
app.use('/regist_serial_number', registSerialNumberRouter);
app.use('/get_user_nutrian_info', getUserNutrianInfoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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