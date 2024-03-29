var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')

var index = require('./routes/index');
var auth = require('./routes/auth')
var goods = require('./routes/goods')
var users = require('./routes/users')

require('./servers/mongoose_server')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  if(req.cookies.userId) {
    next()
  } else {
    let url = req.path
    if(url === '/users/login' || url === '/users/logout' || url === '/goods/list' || url === '/users/checkLogin'){
      next()
    } else {
      res.status(401)
      res.json({
        code: -1,
        msg: '请先登录'
      })
    
    }
  }

})


//app.use(auth)

app.use('/', index);
app.use('/users',users)
app.use('/goods',goods)

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
