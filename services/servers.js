/**
 * Created by admin on 2017/4/14.
 */

'use strict';

module.exports = {
  getServers,
  addServers
};

async function getServers() {
  return db.Servers.find().sort({'date': -1});
}

async function addServers(options) {
  const newObj = new db.Servers(options);
  return newObj.save();
}