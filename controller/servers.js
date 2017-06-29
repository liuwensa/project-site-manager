/**
 * Created by admin on 2017/6/29.
 */

'use strict';

const Servers = require('../services/servers');

module.exports = {
  getServers,
  addServers
};

async function getServers(req, res) {
  const servers = await Servers.getServers();
  return res.json({code: 0, msg: servers});
}

async function addServers(req, res) {
  const options = req.body;
  const servers = await Servers.addServers(options);
  return res.json({code: 0, msg: servers});
}
