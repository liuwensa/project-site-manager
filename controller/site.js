'use strict';

const cp       = require('child_process');
const socketio = require('socket.io');

const ProjectService = require('../services/project');

exports.site = async function (req, res, next) {
  const proID    = req.params.proID;
  const serverID = req.query.serverID || '';

  const proDtl = await ProjectService.getProjectDtl({_id: proID});

  const servers = proDtl.servers;

  res.locals.menus    = 'site';
  res.locals.proID   = proID;
  res.locals.proDtl  = proDtl;
  res.locals.servers = servers;

  let serverHost;

  if (serverID) {
    res.locals.serverID = serverID;
    for (let i = 0, len = servers.length; i < len; i++) {
      if (servers[i]._id === serverID) {
        serverHost = servers[i].host;
        break;
      }
    }
  } else {
    res.locals.serverID   = servers[0]._id;
    serverHost = servers[0].host;
  }

  res.locals.serverHost = `${serverHost}:${config.port}`;

  res.render('index');
};

exports.socket = function (server) {
  const io   = socketio(server);
  const site = io.of('/socket/site');

  // 连接对象
  site.on('connection', function (socket) {
    socket.on('exec', function (data) {
      var arg       = _makeCmd(data);
      const options = {
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME
        }
      };

      if (arg.cwd) {
        options.cwd = arg.cwd;
      }

      var child = cp.spawn(arg.cmd, arg.args, options);
      // 打印子进程的输出数据
      child.stdout.on('data', function (data) {
        // console.log(data.toString());
        socket.emit('data', data.toString());
      });

      // 监听子进程的错误流数据
      child.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
        socket.emit('err', data.toString());
      });

      // 监听子进程的退出事件
      child.on('close', function (code) {
        console.log('子进程退出，code：' + code);
        socket.emit('err', '子进程退出，code：' + code);
      });
    });

    // 连接断开处理
    socket.on('disconnect', function () {
      logger.info('disconnect, 连接断开处理');
    });
  });
};

// 构建命令
function _makeCmd(data) {
  let cmd     = '';
  let args    = [];
  let cwd     = '';
  switch (data.cmd) {
    case 'pull':
      cmd  = 'git';
      args = ['pull'];
      cwd  = data.proPath;
      break;
    case 'restart':
      cmd  = 'pm2';
      args = ['restart', data.eName];
      cwd  = '';
      break;
    case 'npm':
      cmd  = 'cnpm';
      args = ['install'];
      cwd  = data.proPath;
      break;
    case 'log':
      cmd  = 'tail';
      args = ['-f', `${data.logPath }/log-${new Date().Format('yyyyMMdd')}`];
      cwd  = '';
      break;
  }

  return {
    cmd : cmd,
    args: args,
    cwd : cwd
  }
}