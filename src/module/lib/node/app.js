var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var cors=require('cors');

var renders = require('./routes/renders/index');
var pages = require('./routes/pages/index');
// var mock = require('./routes/mock/index');
var apis = require('./routes/apis/index');
let fs=require('fs-extra');

var rfs = require('rotating-file-stream')



var app = express();

// view engine setup,使用render
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


//打日志
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs('error.log', {
  interval: '3d', // rotate daily
  path: logDirectory
});



app.use(logger('combined', {
stream: accessLogStream,
skip:function(req,res){
  return res.statusCode>200&&res.statusCode<400;
}
}));
//结束打日志




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// app.use(cors());//是否跨域

app.use('/', renders);
app.use('/', pages);
// app.use('/',mock);
app.use('/',apis);






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
