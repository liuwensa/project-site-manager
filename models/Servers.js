/**
 * Created by admin on 2017/4/14.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ServerSchema = new Schema({
  _id     : {
    type     : String,
    unique   : true,
    default: shortid.generate
  },
  host    : String
});

const Servers = mongoose.model('Servers', ServerSchema);

module.exports = Servers;