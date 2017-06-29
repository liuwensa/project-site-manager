/**
 * Created by admin on 2017/4/14.
 */

'use strict';

module.exports = {
  getProjects,
  getProjectDtl,
  addProjects
};

async function getProjects() {
  return db.Project
    .find()
    .populate('servers')
    .sort({'date': -1});
}

async function getProjectDtl(options) {
  return db.Project
    .findOne(options)
    .populate('servers');
}

async function addProjects(options) {
  const newObj = new db.Project(options);
  return newObj.save();
}