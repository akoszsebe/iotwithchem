'use strict';

let path = require('path'),
  Temperature = require(path.resolve('backend/models/temperature.js')),
  Ph = require(path.resolve('backend/models/ph.js')),
  Alive = require(path.resolve('backend/models/alive.js')),
  Job = require(path.resolve('./backend/models/job.js')),
  mongoose = require('mongoose');


/**
 * Create a DBWS class to handle:
 * 1. download  data to the historian db
 */
const DbWs = module.exports = function () {

  this.mongoose = mongoose;
  this.lastAliveDate = 0;
  this.init()

};


/**
 *  Init the entity layer and others...
 *
 */
DbWs.prototype.init = function () {

  const self = this;
  self.mongoose.Promise = global.Promise;

  // database connection settings
  self.mongoose.connection.on('open', () => {
    console.info('Connected to mongo server.')
  });

  self.mongoose.connection.on('error', (error) => {
    console.error('Could not connect to mongo server!', error)
  });

  // connect to database on mongolab
  //regi mongo kemiasoke :mongodb://heroku_hww55rc1:2ic4cjhncvmlse83a21lnejpru@ds139187.mlab.com:39187/heroku_hww55rc1
  self.mongoose.connect('mongodb://heroku_1v5ndzf5:jhh1cjdvneikc2p77n0b3n32j7@ds113938.mlab.com:13938/heroku_1v5ndzf5', function (err) {
    if (err) console.error('erros:' + err)
  }) //('mongodb://votiv:votiv@ds031257.mlab.com:31257/kemia-db')

};


/**
 * Close method to handle the connection cloe explicitely
 */
DbWs.prototype.close = function () {

  const self = this;

  self.mongoose.Promise = global.Promise;

  self.mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');

  })
};


/**
 * get temperaure sensor value
 */
DbWs.prototype.getTemperatureSensors = function (_callback) {

  const _sensorids = new Set();
  Temperature.find({}, '-_id -__v', (error, sensors) => {
    if (error) {
      return _callback(null)
    }
    sensors.forEach(function (item) {
      _sensorids.add(item.sensorid)
    });
    return _callback(Array.from(_sensorids))
  })
};

/**
 * get temperaure  value
 */
DbWs.prototype.getTemperature = function (sensorid, _callback) {

  Temperature.findOne({}, '-_id -__v', (error, temperatures) => {
    if (error) {
      return _callback(null)
    }
    return _callback(temperatures)
  }).where('sensorid').equals(sensorid).sort({'tempdate': 'descending'})
};

/**
 * get temperaure  interval vaue
 */
DbWs.prototype.getTemperatureInterval = function (sensorid, datefrom, dateto, _callback) {

  Temperature.find({'tempdate': {'$gte': datefrom, '$lt': dateto}}, '-_id -__v', (error, temperatures) => {
    if (error) {
      return _callback(null)
    }
    return _callback(temperatures)
  }).where('sensorid').equals(sensorid)
};

/**
 * get ph sensor   value
 */
DbWs.prototype.getPhSensors = function (_callback) {

  const _sensorids = new Set();
  Ph.find({}, '-_id -__v', (error, sensors) => {
    if (error) {
      return _callback(null)
    }
    sensors.forEach(function (item) {
      _sensorids.add(item.sensorid)
    });
    return _callback(Array.from(_sensorids))
  })
};

/**
 * get ph    value
 */
DbWs.prototype.getPh = function (sensorid, _callback) {

  Ph.findOne({}, '-_id -__v', (error, ph) => {
    if (error) {
      return _callback(null)
    }
    return _callback(ph)
  }).where('sensorid').equals(sensorid).sort({'phdate': 'descending'})
};

/**
 * get ph interval value
 */
DbWs.prototype.getPhInterval = function (sensorid, datefrom, dateto, _callback) {

  Ph.find({'phdate': {'$gte': datefrom, '$lt': dateto}}, '-_id -__v', (error, phs) => {
    if (error) {
      return _callback(null)
    }
    return _callback(phs)
  }).where('sensorid').equals(sensorid)
};

/**
 * Get the Pulse ....
 */
DbWs.prototype.getPulse = function (_callback) {
  const self = this;
  Alive.find((error, alivedata) => {
    if (alivedata.length === 0) {
      return (_callback(false))
    }
    const currentLastDate = alivedata[alivedata.length - 1].alivedate;
    if (self.lastAliveDate !== 0 && self.lastAliveDate !== currentLastDate) {
      self.lastAliveDate = currentLastDate;
      return _callback(true)
    } else {
      self.lastAliveDate = currentLastDate;
      return _callback(false)
    }
  })
};

DbWs.prototype.getOldestTemp = function (sensorid, _callback) {

  Temperature.findOne({}, '-_id -__v', (error, temperature) => {
    if (error) {
      return _callback(null)
    }
    return _callback(temperature)
  }).where('sensorid').equals(sensorid).sort({'tempdate': 'ascending'})
};

DbWs.prototype.getOldestPh = function (sensorid, _callback) {

  Ph.findOne({}, '-_id -__v', (error, ph) => {
    if (error) {
      return _callback(null)
    }
    return _callback(ph)
  }).where('sensorid').equals(sensorid).sort({'phdate': 'ascending'})
};

DbWs.prototype.getJob = function (_callback) {

  Job.findOne({}, '-_id', (error, job) => {
    if (error) {
      return _callback(null)
    }
    return _callback(job)
  });
};

DbWs.prototype.setJob = function (newJob, _callback) {

  Job.findOneAndUpdate({}, newJob, {new: true}, (error, job) => {
    if (error) {
      return _callback(null)
    }
    return _callback(job)
  });
};

