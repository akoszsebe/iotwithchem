/**
 * Class to handle all the TemperatureDevice  sensors
 */
var TemperatureDevice = module.exports = function () {
	
}

/*
 * @params callback function
 * @returns err - if error happened , value - the temperature value
 */
TemperatureDevice.prototype.actualValue = function(_callback){
	return _callback(null, 25);
}