/**
 * Created by admin on 2017/3/13.
 */

'use strict';

const mongoose = require('mongoose');

const Servers = require('./Servers');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  _id     : {
    type     : String,
    unique   : true,
    'default': shortid.generate
  },
  name    : String,
  date    : {type: Date, default: Date.now},
  servers : [{type: String, ref: 'Servers'}],
  proPath : String,
  logPath : String
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;

