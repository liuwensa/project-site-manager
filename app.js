'use strict';

require('./global-variable');

const express       = require('express');
const path          = require('path');
const favicon       = require('static-favicon');
const log4js        = require('log4js');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const cookieSession = require('cookie-session');
const http          = require('http');
const ejs           = require('ejs');
const ejsLayout     = require('express-ejs-layouts');

var site = require('./controller/site');
var routes = require('./routes/index');

//加入自定义filter
const ejsFilter = require('./lib/utils/filter').filter(ejs);

var app = express();

app.disable('x-powered-by');
app.enable('trust proxy');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.engine('.html', ejsFilter.__express);
// app.set('view engine', 'html');
// app.set('layout', 'layout');
// app.use(ejsLayout);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(log4js.connectLogger(logger, config.log));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieSession({key: 'sm', secret: config.secret}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err    = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error  : err,
      layout : false
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error  : {},
    layout : false
  });
});

app.set('port', config.port);

const server = http.createServer(app);
// site.socket(server);

server.listen(app.get('port'), function (err) {
  if (err) {
    throw err;
  } else {
    logger.info(`server start on ${app.get('port')}`);
  }
});
