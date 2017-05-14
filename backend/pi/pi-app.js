/*
 **  Create an initial app class
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
  this.temperatureUploadInterval = 30000;
  this.phUploadInterval = 30000;
  this.heatingCheckInterval = 2000;
  this.phCheckInterval = 2000;
  this.messagequeueCheckInterval = 3000;
  this.ph = 0;

  const self = this;
  this.db.getJob(job => {
    if (job) {
      self.messagequeue.sensorValueContext.setHeaterTemperature(job.heaterValue);
      self.messagequeue.sensorValueContext.setTempUploadInterval(job.tempReadInt);
      self.messagequeue.sensorValueContext.setPhValue(job.pumpValue);
      self.messagequeue.sensorValueContext.setPhUploadInterval(job.phReadInt);
    }
  });
};


/**
 * Uploads temp to database
 */
PiApp.prototype.uploadTempToDatabase = function () {
  const self = this;
  this.temperaturedevice.actualValue(function (err, value) {
    console.info('Raspberry -', self.serialnumber);
    console.info('Current temperature on sensor is', value);
    self.db.createTemperatureMessage(self.serialnumber, '1', value, new Date().getTime(), function (err) {
      if (err) {
        console.error(err)
      }
    })
  });

  this.uploadTempTimeout = setTimeout(this.uploadTempToDatabase.bind(this), this.temperatureUploadInterval)
};

/**
 * Uploads ph to database
 */
PiApp.prototype.uploadPhToDatabase = function () {
  const self = this;
  if (this.ph !== 0) {
    console.info('Raspberry -', self.serialnumber);
    console.info('-----Current ph on sensor is: ' + self.ph);
    self.db.createPhMessage(self.serialnumber, '1', this.ph, new Date().getTime(), function (err) {
      if (err) {
        console.error(err)
      }
    })
  }
  else {
    console.info('-----Phsensor is not connected !!!')
  }

  this.uploadPhTimeout = setTimeout(this.uploadPhToDatabase.bind(this), this.phUploadInterval);
};

/**
 * Keeps the temperature between tolerance values
 */
PiApp.prototype.heatingCheck = function () {
  const self = this;
  this.temperaturedevice.actualValue(function (err, value) {
    console.log('Current temperature ----------- ', value);
    if (value < self.heatsourcedevice.lowerHeatTolerance && !self.heatsourcedevice.heatSourceWorking) {
      self.heatsourcedevice.turnOnHeatRelay();
      self.messagequeue.sendMsgToWebServer('Heater:ON');
      console.log("---------------------------------Heater on ")
    }
    else if (value > self.heatsourcedevice.lowerHeatTolerance && self.heatsourcedevice.heatSourceWorking) {
      self.heatsourcedevice.turnOffHeatRelay();
      self.messagequeue.sendMsgToWebServer('Heater:OFF');
      console.log("---------------------------------Heater off ")
    }
  })
};

/**
 * Keeps the ph between tolerance values
 */
PiApp.prototype.phCheck = function () {
  const self = this;
  this.phdevice.getPh(function (phvalue) {
    console.log('Atlas-scientific-PhMeter READ Value: ' + phvalue);
    self.ph = phvalue;
    if (phvalue < (self.pumpdevice.pumpPhValue - self.pumpdevice.pumpDelta) ||
      phvalue > (self.pumpdevice.pumpPhValue + self.pumpdevice.pumpDelta)) {
      if (!self.pumpdevice.pumpWorking) {
        self.pumpdevice.turnOnPump();
        self.messagequeue.sendMsgToWebServer('Pump:ON');
        console.log("---------------------------------pump on")
      }
    } else {
      if (self.pumpdevice.pumpWorking) {
        self.pumpdevice.turnOffPump();
        self.messagequeue.sendMsgToWebServer('Pump:OFF');
        console.log("---------------------------------pump off")
      }
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
      self.messagequeue.sendMsgToWebServer('Ph:Calibrate:Low:' + callbackmsg);
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
      self.messagequeue.sendMsgToWebServer('Ph:Calibrate:Mid:' + callbackmsg);
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
      self.messagequeue.sendMsgToWebServer('Ph:Calibrate:High:' + callbackmsg);
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
    this.heatsourcedevice.setHeatingTo(lastTempInQueue);
  }
  const lastTempUploadIntervalInQueue = parseInt(this.messagequeue.sensorValueContext.getTempUploadInterval());
  if (lastTempUploadIntervalInQueue !== this.temperatureUploadInterval) {
    this.temperatureUploadInterval = lastTempUploadIntervalInQueue;
    clearTimeout(this.uploadTempTimeout);
    this.uploadTempTimeout = setTimeout(this.uploadTempToDatabase.bind(this), this.temperatureUploadInterval)
  }

  const phValue = parseFloat(this.messagequeue.sensorValueContext.getPhValue());
  if (phValue !== this.pumpdevice.pumpPhValue) {
    this.pumpdevice.setPumpPh(phValue);
  }
  const lastPhUploadIntervalInQueue = parseInt(this.messagequeue.sensorValueContext.getPhUploadInterval());
  if (lastPhUploadIntervalInQueue !== this.phUploadInterval) {
    this.phUploadInterval = lastPhUploadIntervalInQueue;
    clearTimeout(this.uploadPhTimeout);
    this.uploadPhTimeout = setTimeout(this.uploadPhToDatabase.bind(this), this.phUploadInterval)
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

  this.uploadTempTimeout = setTimeout(this.uploadTempToDatabase.bind(this), this.temperatureUploadInterval);
  this.uploadPhTimeout = setTimeout(this.uploadPhToDatabase.bind(this), this.phUploadInterval);
  this.heatReporter = setInterval(this.heatingCheck.bind(this), this.heatingCheckInterval);
  this.phcheckTimeout = setTimeout(this.phCheck.bind(this), this.phCheckInterval);
  this.messageQueueWatcher = setInterval(this.messagequeueCheck.bind(this), this.messagequeueCheckInterval)

};

/**
 *  Cancel the main event loop
 */
PiApp.prototype.unsetEventLoop = function () {

  clearTimeout(this.uploadTempTimeout);
  clearTimeout(this.uploadPhTimeout);
  clearInterval(this.heatReporter);
  clearTimeout(this.phcheckTimeout);
  clearInterval(this.messageQueueWatcher);
  this.pumpdevice.turnOffPump();
  this.messagequeue.sendMsgToWebServer('Pump:OFF');
  this.heatsourcedevice.turnOffHeatRelay();
  this.messagequeue.sendMsgToWebServer('Heater:OFF');
};
