var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var token = require('./routes/token');
var login = require('./routes/login');
var tryLogin = require('./routes/tryLogin');
var user = require('./routes/user');
var openid = require('./routes/openid');
var jsapiTicket = require('./routes/jsapiTicket');
//var jsapiTicket = require('./routes/jsapiTicket').router;
var signature = require('./routes/signature').router;
var service = require('./routes/service');
var baiduPush = require('./routes/baiduPush');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', routes);
app.use('/users', users);
app.use('/service', service);
app.use('/baiduPush', baiduPush);
app.use('/token', function(req, res){
  res.json(token.tokenData);
  res.end();
});
//app.use('/login', login);
//app.use('/tryLogin', tryLogin);
app.use('/user', user);
app.use('/openid', openid);
app.use('/jsapiTicket', function(req, res){
  res.json(jsapiTicket);
  res.end();
});
app.use('/signature', signature);
app.use('/',login);
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
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;

