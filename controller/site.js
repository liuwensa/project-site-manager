'use strict';

const cp       = require('child_process');
const socketio = require('socket.io');

exports.site = function (req, res, next) {
  const key     = req.params.site;
  let server  = '';
  const sites   = config.sites;
  const servers = config.servers;
  if (Array.isArray(sites[key].host)) {
    server = sites[key].host[0];
    if (req.query.server && servers[server]) {
      server = req.query.server;
    }
  } else {
    server = sites[key].host;
  }
  res.render('site.html', {menu: 'site', key: key, server: server});
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
  const sites = config.sites;
  let cmd   = '';
  let args  = [];
  let cwd   = '';
  switch (data.cmd) {
    case 'pull':
      cmd  = 'git';
      args = ['pull'];
      cwd  = sites[data.site].proPath;
      break;
    case 'restart':
      cmd  = sites[data.site].restart.cmd;
      args = sites[data.site].restart.args;
      cwd  = '';
      break;
    case 'npm':
      cmd  = 'npm';
      args = ['install'];
      cwd  = sites[data.site].proPath;
      break;
    case 'log':
      cmd  = 'tail';
      args = ['-f', `${sites[data.site].logPath }/log-${new Date().Format('yyyyMMdd')}`];
      cwd  = '';
      break;
  }

  return {
    cmd : cmd,
    args: args,
    cwd : cwd
  }
}