/**
 * Class to handle all the required devices, sensors
 */
var PhDevice = module.exports = function () {
    this.init()
}

PhDevice.prototype.init = function () {
    this.PH_STD_ADDR = 0x63
    this.READ_LENGTH = 7
    this.PH_CMD_READ = 0x52
}

/*
 * @returns the phvalue
 */
PhDevice.prototype.getPh = function (callback) {
	return callback('7.0')
}

/*
 * @return if calibration was Successful or not
 */
PhDevice.prototype.calibrateHigh = function (value,callback) {

}

/*
 * @return if calibration was Successful or not
 */
PhDevice.prototype.calibrateMiddle = function (value,callback) {

}

/*
 * @return if calibration was Successful or not
 */
PhDevice.prototype.calibrateLow = function (value,callback) {

}
