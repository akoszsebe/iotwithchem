'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let jobSchema = new Schema({
    jobStartDate: String,
    jobEndDate: String,
    jobDescription: String
});

module.exports = mongoose.model('Job', jobSchema);