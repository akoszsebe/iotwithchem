'use strict'

let path = require('path'),
	db = require(path.resolve('backend/models/downloadData.js')),
	mq = require(path.resolve('backend/models/messagequeue.js'))

var raspiAlive = false

module.exports = (app, passport) => {

	app.get('/getsensorids', (request, response) => {
		db.getTemperatureSensors(function(returndata){
			response.json(returndata)
		})
	})


	app.get('/gettemperature', (request, response) => {
		var sensorid = request.param('sensorid')
		if (typeof sensorid === 'undefined') sensorid = '1'

		db.getTemperature(sensorid,function(returndata){
			response.json(returndata)
		})
	})


	app.get('/gettemperatureinterval', (request, response) => {
		var sensorid = request.param('sensorid')
		var datefrom = request.param('datefrom')
		var dateto = request.param('dateto')
		if (typeof sensorid === 'undefined') sensorid = '1'

		db.getTemperatureInterval(sensorid,datefrom,dateto,function(returndata){
			response.json(returndata)
		})

	})


	app.get('/isalive', (request, response) => {
		response.json({alive : raspiAlive})
	})

	app.get('/login/facebook',
	passport.authenticate('facebook', { scope: [ 'email' ]}))

	app.get('/login/facebook/return',
	passport.authenticate('facebook', { failureRedirect: '/research', scope : ['email'] }),
	(req, res) => {
		res.redirect('/home')
	})


	app.get('/logout', (req, res) => {
		req.session.destroy()
		res.json({'status' : 'logged out'})
	})

	app.get('/checkAuth', (req, res) => {
		if (req.isAuthenticated()) {
			res.json({'status' : 'authenticated'})
		} else {
			res.json({'status' : 'unauthenticated'})
		}
	})

	app.get('/setheateron', function (req, res) {
    	res.setHeader("Content-Type", "text/json");
    	res.setHeader("Access-Control-Allow-Origin", "*")
		mq.sendmsgtoRaspberry('Heater:ON')
    	res.end(JSON.stringify({ heater: true }));
	})

	app.get('/setheateroff', function (req, res) {
    	res.setHeader("Content-Type", "text/json");
    	res.setHeader("Access-Control-Allow-Origin", "*")
		mq.sendmsgtoRaspberry('Heater:OFF')
    	res.end(JSON.stringify({ heater: false }))
	})

	app.get('/setheatertemperature', function (req, res) {
		var heatertemp = req.param('heatertemp')
    	res.setHeader("Content-Type", "text/json");
    	res.setHeader("Access-Control-Allow-Origin", "*")
		mq.sendmsgtoRaspberry('Heater:Temperature:'+heatertemp)
    	res.end(JSON.stringify({ heater: true }))
	})


	app.get('*', (request, response) => {
		response.sendFile(path.resolve('./frontend/index.html'))
	})


}

setInterval(() => {
	db.getPulse((returndata) => {
		raspiAlive = returndata
	}
)},5000)
