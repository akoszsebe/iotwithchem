'use strict';

let path = require('path'),
  Temperature = require('../../models/temperature.js'),
  Ph = require('../../models/ph.js'),
  Job = require('../../models/job.js'),
  request = require("request"),
  url = "https://iotwithchembeta.herokuapp.com"

/**
 * Create a DB class to handle:
 * 1. upload data to the historian db
 */
const Db = module.exports = function () {
  this.init()

};

/**
 *  Init the entity layer and others...
 *
 */
Db.prototype.init = function () {
  const self = this;

};

/**
 * createTemperatureMessage   method is responsabile for ...
 *
 * rid:
 * sid:
 * tv:
 * td:
 * callback:
 */

Db.prototype.createTemperatureMessage = function (rid, sid, tv, td, _callback) {


  // create a Temperature json object
  const temp = new Temperature({
    raspberryid: rid,
    sensorid: sid,
    tempvalue: tv,
    tempdate: td
  });
  // call the Temperature class save operator
  var options = {
      method: 'get',
      body: temp,
      json: true,
      url: url+"/settemperature"
    }
  request(options, function (err, res, body){
    if (err)
      return _callback(err);
    return _callback(null)
  });
};

/**
 * createPhMessage   method is responsabile for ...
 *
 * rid:
 * sid:
 * pv:
 * pd:
 * callback:
 */

Db.prototype.createPhMessage = function (rid, sid, pv, pd, _callback) {


  // create a Ph json object
  const ph = new Ph({
    raspberryid: rid,
    sensorid: sid,
    phvalue: pv,
    phdate: pd
  });
   var options = {
      method: 'get',
      body: ph,
      json: true,
      url: url+"/setph"
    }
  request(options, function (err, res){
    if (err)
      return _callback(err);
    return _callback(null)
  });

};


Db.prototype.getJob = function (_callback) {
  request(url+"/getJob", function (err, res, body){
    if (err)
      return _callback(err);
      console.log(body)
    return _callback( JSON.parse(body))
  });
};


