'use strict';

const express = require('express');

const login     = require('../controller/login');
const adminuser = require('../controller/adminUser');
const site      = require('../controller/site');


const router = express.Router();

router.get('/', login.checkAuth, (req, res) => {
  res.render('index', {title: '站点管理系统', layout: 'layout', menu: 'index'});
});

router.route('/login')
  .get(login.getLogin)
  .post(login.postLogin);

router.get('/logout', login.checkAuth, login.logout);

router.get('/site/:site', login.checkAuth, site.site);

router.route('/adminuser')
  .get(adminuser.getAdminUsers)
  .post(adminuser.addUser);

module.exports = router;
