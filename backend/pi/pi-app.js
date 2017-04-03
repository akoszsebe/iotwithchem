/*
 **  Create an initial   app class
 ** with the injected external dependencies
 **
 */
const PiApp = module.exports = function (db, temperaturedevice, heatsourcedevice, phdevice, pumpdevice, gateway, messagequeue) {
  this.db = db;
  this.temperaturedevice = temperaturedevice;
  this.heatsourcedevice = heatsourcedevice;
  this.phdevice = phdevice;
  this.pumpdevice = pumpdevice;
  this.gateway = gateway;
  this.messagequeue = messagequeue
};

/**
 *   Init functions
 *
 */
PiApp.prototype.init = function () {
  this.serialnumber = this.gateway.fingerPrint();
  this.hearthBeatInterval = 3000;
  this.temperatureUploadInterval = 30000;
  this.phUploadInterval = 30000;
  this.heatingCheckInterval = 2000;
  this.phCheckInterval = 2000;
  this.messagequeueCheckInterval = 3000;
  this.ph = 0
};


/**
 * Uploads data to database
 */
PiApp.prototype.uploadDataToDatabase = function () {
  const self = this;
  this.temperaturedevice.actualValue(function (err, value) {
    console.info('Raspberry -', self.serialnumber);
    console.info('Current temperature on sensor is', value);
    self.db.createTemperatureMessage(self.serialnumber, '1', value, new Date().getTime(), function (err) {
      if (err) console.error(err)
    })
  });

  if (this.ph !== 0) {
    console.info('Raspberry -', self.serialnumber);
    console.info('-----Current ph on sensor is: ' + self.ph);
    self.db.createPhMessage(self.serialnumber, '1', this.ph, new Date().getTime(), function (err) {
      if (err) console.error(err)
    })
  }
  else {
    console.info('-----Phsensor is not connected !!!')
  }
  this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this), this.temperatureUploadInterval)
};

/**
 * Uploads alive data to database
 */

PiApp.prototype.IsAlive = function () {
  const self = this;
  const currentDate = new Date().getTime();
  this.db.createAliveMessage(self.serialnumber, currentDate, function (err) {
    if (err) console.error(err)
  });
  console.info('Alive -', currentDate)
};

/**
 * Keeps the temperature betweet tolerance values
 */
PiApp.prototype.heatingCheck = function () {
  const self = this;
  this.temperaturedevice.actualValue(function (err, value) {
    console.log('Current temperature', value);
    if (value < self.heatsourcedevice.lowerHeatTolerance) {
      self.heatsourcedevice.turnOnHeatRelay();
      this.messagequeue.sendmsgtoWebserver('Heater:ON')
    }
    else if (value > self.heatsourcedevice.upperHeatTolerance) {
      self.heatsourcedevice.turnOffHeatRelay();
      this.messagequeue.sendmsgtoWebserver('Heater:OFF')
    }
  })
};

/**
 * Keeps the ph betweet tolerance values
 */
PiApp.prototype.phCheck = function () {
  const self = this;
  this.phdevice.getPh(function (phvalue) {
    console.log('Atlas-scientific-PhMeter READ Value: ' + phvalue);
    self.ph = phvalue;
    if (phvalue < (self.pumpdevice.pumpPhValue - self.pumpdevice.pumpDelta) ||
      phvalue > (self.pumpdevice.pumpPhValue + self.pumpdevice.pumpDelta)) {
      self.pumpdevice.turnOnPump();
      this.messagequeue.sendmsgtoWebserver('Pump:ON')
    } else {
      self.pumpdevice.turnOffPump();
      this.messagequeue.sendmsgtoWebserver('Pump:OFF')
    }
  });
  this.phcheckTimeout = setTimeout(this.phCheck.bind(this), this.phCheckInterval)
};

/**
 * Calibrate Low Ph sensor (ph = 4.00 )
 */
PiApp.prototype.phCalibrateLow = function () {
  const self = this;
  clearTimeout(self.phcheckTimeout);
  const ph = '4.00';
  setTimeout(function () {
    self.phdevice.calibrateLow(ph, function (callbackmsg) {
      console.log('Calibration Low on PhSensor was ' + callbackmsg);
      this.messagequeue.sendmsgtoWebserver('Ph:Calibrate:Low:' + callbackmsg);
      self.phcheckTimeout = setTimeout(self.phCheck.bind(self), self.phCheckInterval)
    })
  }, 1000);
};

/**
 * Calibrate Middle Ph sensor (ph = 7.00 )
 */
PiApp.prototype.phCalibrateMid = function () {
  const self = this;
  clearTimeout(self.phcheckTimeout);
  const ph = '7.00';
  setTimeout(function () {
    self.phdevice.calibrateMiddle(ph, function (callbackmsg) {
      console.log('Calibration Mid on PhSensor was ' + callbackmsg);
      this.messagequeue.sendmsgtoWebserver('Ph:Calibrate:Mid:' + callbackmsg);
      self.phcheckTimeout = setTimeout(self.phCheck.bind(self), self.phCheckInterval)
    })
  }, 1000);
};

/**
 * Calibrate High Ph sensor (ph = 10.00 )
 */
PiApp.prototype.phCalibrateHigh = function () {
  const self = this;
  clearTimeout(self.phcheckTimeout);
  const ph = '10.00';
  setTimeout(function () {
    self.phdevice.calibrateHigh(ph, function (callbackmsg) {
      console.log('Calibration High on PhSensor was ' + callbackmsg);
      this.messagequeue.sendmsgtoWebserver('Ph:Calibrate:High:' + callbackmsg);
      self.phcheckTimeout = setTimeout(self.phCheck.bind(self), self.phCheckInterval)
    })
  }, 1000);
};

/**
 * Checks if the heating value has changed in messagequeue
 * and sends a message if it changed here to.
 * Checks if uploadInterval was changed and updates that too
 */
PiApp.prototype.messagequeueCheck = function () {
  const lastTempInQueue = parseInt(this.messagequeue.sensorValueContext.getHeaterTemperature());
  const currentHeatingValue = this.heatsourcedevice.heatingValue;
  console.info('LastTempInQueue', lastTempInQueue);
  console.info('CurrentHeatValue', currentHeatingValue);
  if (lastTempInQueue !== currentHeatingValue) {
    this.heatsourcedevice.setHeatingTo(lastTempInQueue)
  }
  const lastUploadIntervalinQueue = parseInt(this.messagequeue.sensorValueContext.getUploadInterval());
  if (lastUploadIntervalinQueue !== this.temperatureUploadInterval) {
    this.temperatureUploadInterval = lastUploadIntervalinQueue;
    clearTimeout(this.uploadDataTimeout);
    this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this), this.temperatureUploadInterval)
  }

  const phValue = parseFloat(this.messagequeue.sensorValueContext.getPhValue());
  if (phValue !== this.pumpdevice.pumpPhValue) {
    this.pumpdevice.setPumpPh(phValue)
  }

  const calibrate = this.messagequeue.sensorValueContext.getCalibration();
  switch (calibrate) {
    case 'L':
      this.phCalibrateLow();
      this.messagequeue.sensorValueContext.resetCalibration();
      break;
    case 'M':
      this.phCalibrateMid();
      this.messagequeue.sensorValueContext.resetCalibration();
      break;
    case 'H':
      this.phCalibrateHigh();
      this.messagequeue.sensorValueContext.resetCalibration();
      break
  }
};

/**
 *  Set the main event loop
 *
 *  */
PiApp.prototype.setEventLoop = function () {

  setInterval(this.IsAlive.bind(this), this.hearthBeatInterval);
  this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this), this.temperatureUploadInterval);
  setInterval(this.heatingCheck.bind(this), this.heatingCheckInterval);
  this.phcheckTimeout = setTimeout(this.phCheck.bind(this), this.phCheckInterval);
  setInterval(this.messagequeueCheck.bind(this), this.messagequeueCheckInterval)

};
