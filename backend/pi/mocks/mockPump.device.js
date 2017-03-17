/**
 * Class to handle all the required devices, sensors
 */

var PumpDevice = module.exports = function () {
	this.init()
}

PumpDevice.prototype.init = function () { 
	this.pumpPin = 13
	this.pumpWorking = true
	this.pumpPhValue = 7.0
	this.pumpDelta = 1

}

/*
 * Turns off the pump
 */
PumpDevice.prototype.turnOffPump = function() {
	console.info('Turned OFF PUMP!')
}

/*
 * Turns on the pump
 */
PumpDevice.prototype.turnOnPump = function() {
	console.info('Turned ON PUMP!')
}

PumpDevice.prototype.getPumpPh = function() {
	return this.pumpPhValue;
}

PumpDevice.prototype.setPumpPh = function(value) {
	this.pumpPhValue = value;
}

PumpDevice.prototype.checkPumpStatus = function() {
	return this.pumpWorking;
}