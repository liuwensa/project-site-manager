/**
 * Created by admin on 2017/6/29.
 */

'use strict';

const Project = require('../services/project');

module.exports = {
  getProjects,
  getProjectDtl,
  addProjects
};

async function getProjects(req, res) {
  const results = await Project.getProjects();
  return res.json({code: 0, msg: results});
}

async function getProjectDtl(req, res) {
  const proID = req.params.proID;

  const results = await Project.getProjectDtl({_id: proID});
  return res.json({code: 0, msg: results});
}

async function addProjects(req, res) {
  // const options = req.body;
  const options = {
    name: '游信',
    eName: 'youxin',
    type   : 'node',
    proPath: '/var/www/x9/running/',
    logPath: '/raid/logs/project-site-manager/main',
    servers: ['BkSXIHfE-', 'SydisBzVZ']
  };
  const results = await Project.addProjects(options);
  return res.json({code: 0, msg: results});
}
