/**
 * Class to handle all the required devices, sensors
 * */

'use strict';
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
  this.willTurnOnIn = 10000; // Milliseconds

};

/*
 * Turns off the pump
 */
PumpDevice.prototype.turnOffPump = function () {
  clearInterval(this.standByFunction);
  this.standByToTurnOn = false;
  if (this.pumpWorking) {
    console.info('\x1b[31m%s\x1b[0m','Turned OFF PUMP!');
    this.pumpWorking = false;

  }
};

/*
 * Turns on the pump
 */
PumpDevice.prototype.turnOnPump = function () {
  const self = this;
  if (!this.pumpWorking) {
    console.info('\x1b[32m%s\x1b[0m','Turned ON PUMP!');
    this.pumpWorking = true;
    console.info('Pump will turn off in 5 second')
      setTimeout(function(){
        self.turnOffPump();
      },self.pumpWorkingPeriod)
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
    console.info('\x1b[33m%s\x1b[0m','Pump Will turn on in 30 second!');
    this.standByToTurnOn = true;
    self.standByFunction = setTimeout(function(){
      self.turnOnPump();
      console.info('30 Second passed! Pump turns on!');
      messageQueue.sendMsgToWebServer('Pump:ON');
    },self.willTurnOnIn)
  }
}
