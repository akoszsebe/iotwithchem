'use strict'

let path = require('path'),
	Temperature = require(path.resolve('./backend/models/temperature.js')),
	Ph= require(path.resolve('./backend/models/ph.js')),
	Alive = require(path.resolve('./backend/models/alive.js')),
	mongoose = require('mongoose')
mongoose.Promise = global.Promise

//database connection settings
mongoose.connection.on('open', (ref) => {
	console.info('Connected to mongo server.', ref)
})

mongoose.connection.on('error', (error) => {
	console.error('Could not connect to mongo server!', error)
})

// connect to database on mongolab
// ujj mongo : mongodb://heroku_1v5ndzf5:jhh1cjdvneikc2p77n0b3n32j7@ds113938.mlab.com:13938/heroku_1v5ndzf5
//regi mongo kemiasoke :mongodb://heroku_hww55rc1:2ic4cjhncvmlse83a21lnejpru@ds139187.mlab.com:39187/heroku_hww55rc1
mongoose.connect('mongodb://heroku_1v5ndzf5:jhh1cjdvneikc2p77n0b3n32j7@ds113938.mlab.com:13938/heroku_1v5ndzf5',function(err) {
	if (err) console.error('erros:' + err)
})

function createTemperatureMessage(rid,sid,tv,td,_callback){
	var t = new Temperature({  
		raspberryid : rid,
		sensorid : sid,
		tempvalue : tv,
		tempdate :  td
	})

	t.save(function(err) {
		if (err) 
			return _callback(err)
	})
	return _callback(null)
}

function createPhMessage(rid,sid,pv,pd,_callback){
	var t = new Ph({  
		raspberryid : rid,
		sensorid : sid,
		phvalue : pv,
		phdate :  pd
	})

	t.save(function(err) {
		if (err) 
			return _callback(err)
	})
	return _callback(null)
}

function createAliveMessage(rid,td,_callback){
	var a= new Alive({  
		raspberryid : rid,
		alivedate : td
	})

	Alive.find((error, alivedata) => {
		if(alivedata.length != 0){
			alivedata[0].remove();
		}
		
		a.save(function(err) {
		if (err) 
			return _callback(err)
		})
	return _callback(null)
	})
	
}


module.exports.createTemperatureMessage = createTemperatureMessage
module.exports.createPhMessage = createPhMessage
module.exports.createAliveMessage = createAliveMessage

