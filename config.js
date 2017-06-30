'use strict';

const port = 9999;

module.exports = {
  port      : port,
  cookieName: 'admin',
  secret    : 'sitemanager',
  log       : {
    nolog         : /\.(js|css|png|jpeg|ico|gif|svg)$/,
    level         : 'AUTO',
    format        : ':remote-addr :method :url :status :response-time ms :user-agent :content-length',
    logFileDir    : '/raid/logs/project-site-manager',
    needConsole   : true,
    replaceConsole: true
  },
  db        : {
    dbprefix: 'mongodb://',
    dbhost  : '121.201.116.25',
    port    : '27017',
    dbname  : 'sit_manager',
    username: '',
    password: ''
  },
};

