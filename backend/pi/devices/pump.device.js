const gpio = require('rpi-gpio');

/**
 * Class to handle all the required devices, sensors
 */
const PumpDevice = module.exports = function () {
  this.init()
};

PumpDevice.prototype.init = function () {
  this.pumpPin = 13;
  this.pumpWorking = true;
  this.pumpPhValue = 7.0;
  this.pumpDelta = 1;
  this.standByToTurnOn = false;
  this.standByFunction = undefined;
  this.pumpWorkingPeriod = 5000 // ms
  this.willTurnOnIn = 30000; // Milliseconds
  gpio.setup(this.pumpPin, gpio.DIR_OUT, this.turnOffPump.bind(this))
};

/*
 * Turns off the pump
 */
PumpDevice.prototype.turnOffPump = function () {
  clearInterval(this.standByFunction);
  this.standByToTurnOn = false;
  if (this.pumpWorking) {
    this.pumpWorking = false;
    gpio.write(this.pumpPin, true, function (err) {
      if (err) {
        throw err;
      }
      console.info('Turned OFF PUMP!')
    })
  }
};

/*
 * Turns on the pump
 */
PumpDevice.prototype.turnOnPump = function () {
  const self = this;
  if (!this.pumpWorking) {
    this.pumpWorking = true;
    gpio.write(this.pumpPin, false, function (err) {
      if (err) {
        throw err;
      }
      console.info('Turned ON PUMP!')
      console.info('Pump will turn off in 5 second')
      setTimeout(function(){
        self.turnOffPump();
      },self.pumpWorkingPeriod)
    })
  }
};

PumpDevice.prototype.getPumpPh = function () {
  return this.pumpPhValue;
};

PumpDevice.prototype.setPumpPh = function (value) {
  this.pumpPhValue = value;
};

PumpDevice.prototype.checkPumpStatus = function () {
  return this.pumpWorking;
};

PumpDevice.prototype.getReadyToTurnOn = function(messageQueue) {
  const self = this;
  if(this.standByToTurnOn == false){
    console.info('Pump Will turn on in 30 second!');
    this.standByToTurnOn = true;
    self.standByFunction = setTimeout(function(){
      self.turnOnPump();
      console.info('30 Second passed! Pump turns on!');
      messageQueue.sendMsgToWebServer('Pump:ON');
    },self.willTurnOnIn)
  }
};