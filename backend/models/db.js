

'use strict'

let path = require('path'),
	Temperature = require(path.resolve('./backend/models/temperature.js')),
	Alive = require(path.resolve('./backend/models/alive.js')),
	mongoose = require('mongoose')

/** 
 * Create a DB class to handle: 
 * 1. upload data to the historian db 
 */
var Db = module.exports = function ( ) { 

	this.mongoose = mongoose 

}

/**
 *  Init the entity layer and others...
 * 
 */
Db.prototype.init = function () {
	var self = this 
	
	self.mongoose.Promise = global.Promise

    //database connection settings
	self.mongoose.connection.on('open', (ref) => {
	    console.info('Connected to mongo server.', ref)
	})

	self. mongoose.connection.on('error', (error) => {
	    console.error('Could not connect to mongo server!', error)
	})

    // connect to database on mongolab
    // ujj mongo : mongodb://heroku_1v5ndzf5:jhh1cjdvneikc2p77n0b3n32j7@ds113938.mlab.com:13938/heroku_1v5ndzf5
	self.mongoose.connect('mongodb://heroku_hww55rc1:2ic4cjhncvmlse83a21lnejpru@ds139187.mlab.com:39187/heroku_hww55rc1',
        function(err) { 
            if (err) console.error('erros:' + err)
         })
}

/**
 * createTemperatureMessage   method is responsabile for ...
 * 
 * rid: 
 * sid: 
 * tv: 
 * td: 
 * callback:  
 */

Db.prototype.createTemperatureMessage = function (rid,sid,tv,td,_callback){
	var self = this
    
    // create a Temperature json object 
	var t = new Temperature({  
		raspberryid : rid,
		sensorid : sid,
		tempvalue : tv,
		tempdate :  td
	})
    // call the Temperature class save operator 
	t.save(function(err) {
		if (err) 
			return _callback(err)
	})
	return _callback(null)
}

/** 
 * createAliveMessage method is responsabile ...
 * rid: 
 * td: 
 * callback 
 */
Db.prototype.createAliveMessage = function ( rid,td,_callback){

    var self = this 
    // creae a new Alive object 
	var a= new Alive({  
		raspberryid : rid,
		alivedate : td
	})

    // call the Alive class save operator 
	a.save(function(err) {
		if (err) 
			return _callback(err)
	})
	return _callback(null)
}

