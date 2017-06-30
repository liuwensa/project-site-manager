'use strict';

const express = require('express');

const login     = require('../controller/login');
const adminuser = require('../controller/adminUser');
const Servers = require('../controller/servers');
const Project = require('../controller/project');
const site      = require('../controller/site');


const router = express.Router();

router.get('/', login.checkAuth, (req, res) => {
  res.locals.menus = 'index';
  res.render('index');
});

router.route('/login')
  .get(login.getLogin)
  .post(login.postLogin);

router.get('/logout', login.checkAuth, login.logout);

router.get('/admin/projects/:proID', login.checkAuth, site.site);

router.route('/adminuser')
  .get(adminuser.getAdminUsers)
  .post(adminuser.addUser);

router.route('/adminusers/:id')
  .get(adminuser.getUser);

router.route('/servers')
  .get(Servers.getServers)
  .post(Servers.addServers);

router.route('/projects')
  .get(Project.getProjects)
  .post(Project.addProjects);

router.get('/projects/:proID', Project.getProjectDtl);

module.exports = router;
