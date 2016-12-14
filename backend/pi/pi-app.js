/* 
**  Create an initial   app class
** with the injected external dependencies  
** 
*/ 
var PiApp = module.exports =  function (db, temperaturedevice, heatsourcedevice, pumpdevice, gateway, messagequeue) {
	this.db                          = db
	this.temperaturedevice           = temperaturedevice  
	this.heatsourcedevice            = heatsourcedevice 
	this.pumpdevice                  = pumpdevice
	this.gateway 		             = gateway
	this.messagequeue                = messagequeue
} 

/**
 *   Init functions 
 * 
 */
PiApp.prototype.init = function () { 
	this.serialnumber   = this.gateway.fingerPrint()
	this.hearthBeatInterval = 3000 
	this.temperatureUploadInterval = 30000 
	this.heatingCheckInterval = 2000
	this.messagequeueCheckInterval = 3000
} 


/** 
 * Uploads data to database 
 */
PiApp.prototype.uploadDataToDatabase = function () {
	var self = this 
	this.temperaturedevice.actualValue(function(err,value){
		console.info('Raspberry -', self.serialnumber)
		console.info('Current temperature on sensor is', value)
		self.db.createTemperatureMessage(self.serialnumber,'1',value,new Date().getTime(),function(err){
			if (err) console.error(err)            
		})
	})
	this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this),this.temperatureUploadInterval)
}

/** 
 * Uploads alive data to database
 */

PiApp.prototype.IsAlive = function () {
	var self = this 
	var currentDate = new Date().getTime()
	this.db.createAliveMessage(self.serialnumber, currentDate,function(err){
		if (err) console.error(err)            
	})
	console.info('Alive -',currentDate)
}
 
/** 
 * Keeps the temperature betweet tolerance values
 */
PiApp.prototype.heatingCheck = function(){
	var self = this 
	this.temperaturedevice.actualValue(function(err,value){
		console.log('Current temperature',value)
		if( value < self.heatsourcedevice.lowerHeatTolerance){
			self.heatsourcedevice.turnOnHeatRelay()
		}
		else if( value> self.heatsourcedevice.upperHeatTolerance){
			self.heatsourcedevice.turnOffHeatRelay()
		}
	})
}

/**
 * Checks if the heating value has changed in messagequeue
 * and sends a message if it changed here to.
 * Checks if uploadInterval was changed and updates that too
 */
PiApp.prototype.messagequeueCheck = function(){
	var lastTempInQueue = parseInt(this.messagequeue.getHeaterTemperature())
	var currentHeatingValue = this.heatsourcedevice.heatingValue
	console.info('LastTempInQueue',lastTempInQueue)
	console.info('CurrentHeatValue',currentHeatingValue)
	if (lastTempInQueue != currentHeatingValue){
		this.heatsourcedevice.setHeatingTo(lastTempInQueue)
		this.messagequeue.sendmsgtoWebserver('Heater:Temperature:'+lastTempInQueue)
	}
	var lastUploadIntervalinQueue = parseInt(this.messagequeue.getUploadInterval())
	if(lastUploadIntervalinQueue != this.temperatureUploadInterval){
		this.temperatureUploadInterval = lastUploadIntervalinQueue
		clearTimeout(this.uploadDataTimeout)
		this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this),this.temperatureUploadInterval)
	}
	var pumpWorking = this.messagequeue.isPumpWorking();
	if(pumpWorking){
		this.pumpdevice.turnOnPump()
	}else{
		this.pumpdevice.turnOffPump()
	}
}

/**
 *  Set the main event loop  
 * 
 *  */ 
PiApp.prototype.setEventLoop = function () {

	setInterval(this.IsAlive.bind(this),this.hearthBeatInterval)
	this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this),this.temperatureUploadInterval)
	setInterval(this.heatingCheck.bind(this),this.heatingCheckInterval)
	setInterval(this.messagequeueCheck.bind(this),this.messagequeueCheckInterval)

}
