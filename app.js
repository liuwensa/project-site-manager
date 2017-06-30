'use strict';

require('./globals');

const express       = require('express');
const path          = require('path');
const favicon       = require('static-favicon');
const log4js        = require('log4js');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const cookieSession = require('cookie-session');
const http          = require('http');
const ejs           = require('ejs');

const site         = require('./controller/site');
const resultHandle = require('./middlewares/result-handle');
const routes       = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(log4js.connectLogger(logger, config.log));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieSession({key: 'sm', secret: config.secret}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  return next({status: 'notFound', code: 404});
});

app.use(resultHandle.resultHandle({format: 'JSON', views: {}}));


app.set('port', config.port);

const server = http.createServer(app);
site.socket(server);

server.listen(app.get('port'), function (err) {
  if (err) {
    throw err;
  } else {
    logger.info(`server start on ${app.get('port')}`);
  }
});
