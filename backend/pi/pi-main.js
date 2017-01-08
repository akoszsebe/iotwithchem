
// load the pi ap module 
var PiApp = require('./pi-app')

// load the Db module 
var Db = require('../models/db')
var db = new Db(); 

// load the gateway module
var Gateway = require('./devices/gateway')
var gateway = new Gateway()

// Create new Temperature Device 
var TemperatureDevice = require('./devices/temperature.device') 
var temperaturedevice = new TemperatureDevice 

//  Create new HeatSource Device 
var HeatSourceDevice =  require ('./devices/heatsource.device')
var heatsourcedevice = new HeatSourceDevice()   

//  Create new PH Device 
var PhDevice =  require ('./devices/ph.device')
var phdevice = new PhDevice()   

// Create new PumpDevice
var PumpDevice = require('./devices/pump.device')
var pumpdevice = new PumpDevice()

// Create new Sensor Values Context 
var SensorValueContext = require ('../models/sensor-value-context')
var sensorValueContext = new SensorValueContext () 

// Create new Message Queue pi -> webservice 
var MQueuePi = require ('../models/mqueue-pi')
var mQueuePi = new MQueuePi (sensorValueContext)  

// create a new instance 
// with the exernal dependencies 
// db, devices, gateway 
var piapp = new PiApp(db, temperaturedevice, heatsourcedevice, phdevice, pumpdevice, gateway, mQueuePi)

// Initialize the pi app 
piapp.init()
// start the event loop of the pi app 
piapp.setEventLoop()


