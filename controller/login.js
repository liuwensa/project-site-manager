'use strict';

const user = require('../services/adminUser');

module.exports = {
  getLogin,
  postLogin,
  logout,
  checkAuth
};

async function getLogin(req, res, next) {
  res.render('login');
}

async function postLogin(req, res, next) {
  const {account, password} = req.body;

  if (!account || !password) {
    return res.render('login', {message: '账号或者密码不能为空！'});
  }

  const userInfo = await user.getUser({account: account});

  if (!userInfo) {
    return res.render('login', {message: '账号不存在！'});
  }

  if (userInfo.password !== password) {
    return res.render('login', {message: '密码不正确！'});
  }
  req.session.userAccount = account;
  const authToken  = tool.encrypt(userInfo._id + '\t' + userInfo.role + '\t' + userInfo.account, config.secret);

  // 会话cookie
  res.cookie(config.cookieName, authToken, {path: '/'});
  res.redirect('/')
}


// 退出登录
async function logout(req, res, next) {
  if (req.session.userAccount) {
    delete req.session.userAccount;
  }
  res.clearCookie(config.cookieName, {path: '/'});
  res.redirect('/');
}

async function checkAuth(req, res, next) {
  if (req.session.userAccount) {
    const account = req.session.userAccount;
    const userInfo = await user.getUser({account: account});

    res.locals.projects = userInfo.projects;
    res.locals.user     = userInfo;

    next();
  } else {
    res.redirect('/login');
  }
}
