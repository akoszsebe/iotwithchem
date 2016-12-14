var gpio = require('rpi-gpio')

/**
 * Class to handle all the required devices, sensors
 */

var PumpDevice = module.exports = function () {
	this.init()
}

PumpDevice.prototype.init = function () { 
	this.pumpPin = 13
	this.pumpWorking = true
	gpio.setup(this.pumpPin, gpio.DIR_OUT,this.turnOffPump.bind(this))
}

/*
 * Turns off the pump
 */
PumpDevice.prototype.turnOffPump = function() {
	if(this.pumpWorking){
		this.pumpWorking = false
		gpio.write(this.pumpPin, false, function(err) {
			if(err) throw err
			console.info('Turned OFF PUMP!')
		})
	}
}

/*
 * Turns on the pump
 */
PumpDevice.prototype.turnOnPump = function() {
	if(!this.pumpWorking){
		this.pumpWorking = true
		gpio.write(this.pumpPin, true, function(err) {
			if(err) throw err
			console.info('Turned ON PUMP!')
		})
	}
}