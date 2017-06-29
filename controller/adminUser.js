/**
 * Created by admin on 2017/4/14.
 */

'use strict';

const adminUser = require('../services/adminUser');

module.exports = {
  getAdminUsers,
  addUser
};

async function getAdminUsers(req, res) {
  const users = await adminUser.getAdminUsers();
  return res.json({code: 0, msg: users});
}

async function addUser(req, res) {
  const options = req.body;
  // const options = {
  //   account: 'root',
  //   role: 'admin',
  //   nickname: '超级管理员'
  // };
  const users = await adminUser.addUser(options);
  return res.json({code: 0, msg: users});
}
