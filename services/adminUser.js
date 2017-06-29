/**
 * Created by admin on 2017/4/14.
 */

'use strict';

module.exports = {
  getAdminUsers,
  getUser,
  addUser
};

async function getAdminUsers() {
  return db.AdminUser.find().sort({'date': -1});
}

async function getUser(options) {
  return db.AdminUser.findOne(options).populate('projects');
}

async function addUser(options) {
  const newObj = new db.AdminUser(options);
  return newObj.save();
}