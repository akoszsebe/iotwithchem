'use strict';

let loaded = true;

let mongoose, Schema;

try {
  mongoose = require('mongoose')
} catch (e) {
  loaded = false;
}

if (!loaded) {
  try {
    mongoose = require('../pi/node_modules/mongoose')
  } catch (e) {
    throw e
  }
}

Schema = mongoose.Schema;

let jobSchema = new Schema({
  jobStartDate: String,
  jobEndDate: String,
  jobDescription: String
});

module.exports = mongoose.model('Job', jobSchema);
