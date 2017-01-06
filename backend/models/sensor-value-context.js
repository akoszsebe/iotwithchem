
/** class to handle all the context neccessary
 * values  
*/

var SensorValueContext = module.export = function () {

	this.heatertemperature = 0
	this.uploadTempInterval = 30000
	this.calibrate = 'N' //no calibration
	this.pumpIsWorking = false
	this.phValue = 7.0

}

SensorValueContext.prototype.getHeaterTemperature = function () {
	return this.heatertemperature
}
SensorValueContext.prototype.setHeaterTemperature = function ( value ) {
	this.heatertemperature = value 
}



SensorValueContext.prototype.getUploadInterval = function () {
	return this.uploadTempInterval
}

SensorValueContext.prototype.setUploadInterval = function ( value ) {
	this.uploadTempInterval = value 
}


SensorValueContext.prototype.isPumpWorking = function () {
	return this.pumpIsWorking
}

SensorValueContext.prototype.setPumpWorking = function(value) {
	this.pumpIsWorking = value
}


SensorValueContext.prototype.getCalibration = function () {
	return this.calibrate
}

SensorValueContext.prototype.setCalibration = function ( value ) {
	this.calibrate = value 
}


SensorValueContext.prototype.resetCalibration = function () {
	this.calibrate = 'N'
}

SensorValueContext.prototype.getPhValue= function () {
	return this.phValue
}
SensorValueContext.prototype.setPhValue= function ( value ) {
	this.phValue = value 
}


