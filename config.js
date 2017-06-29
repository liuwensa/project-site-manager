'use strict';

const port = 9999;

module.exports = {
  port      : port,
  cookieName: 'admin',
  secret    : 'sitemanager',
  servers   : {
    s1: {host: `127.0.0.1:${port}`, wwwPath: '/var/www/', logPath: '/raid/'}
  },
  sites     : {
    youxin: {
      name   : '游信',
      type   : 'node',
      host   : ['s1'],
      proPath: '/var/www/x9/running/',
      logPath: '/raid/logs/project-site-manager/main',
      //进程重启命令，此命令最终传给child_process执行，根据需要自行配置
      restart: {cmd: 'pm2', args: ['restart', 'youxin']}
    }
  },
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

