var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var overtimeRouter = require('./routes/overtimeRecords');
var payRouter = require('./routes/payRecords');
var countRouter = require('./routes/countLog');
// var demo = require('./routes/demo');
var cors = require('cors')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({
//   secret: '12345',
//   name: 'app',  //这里的name值得是cookie的name，默认cookie的name是：connect.sid
//   cookie: {maxAge: 600000 }, //maxAge是过期时间
//   resave: false,
//   saveUninitialized: false,
// }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(
  {
    credentials: true,
    // origin: 'http://172.31.217.31:3000', // 服务器地址
    origin: 'http://localhost:9999', // 本地
    // origin: 'http://localhost:3000', // 本地
    // origin: '*' // 这样会出错
  }
));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/overtime', overtimeRouter);
app.use('/pay', payRouter);
app.use('/count', countRouter);
// app.use('/demo',demo);
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
