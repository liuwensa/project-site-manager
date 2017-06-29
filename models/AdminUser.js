/**
 * Created by admin on 2017/3/13.
 */

'use strict';

const mongoose = require('mongoose');

const Project = require('./Project');

const Schema = mongoose.Schema;

const AdminUserSchema = new Schema({
  _id     : {
    type   : String,
    unique : true,
    default: shortid.generate
  },
  account : String,
  nickname: {type: String, default: '', comment: '昵称'},
  password: {type: String, default: 'e10adc3949ba59abbe56e057f20f883e', comment: '初始密码为123456'},
  role    : {type: String, default: 'user', comment: '权限'},
  projects: [{type: String, ref: 'Project'}],
  date    : {type: Date, default: Date.now}
});

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

module.exports = AdminUser;

