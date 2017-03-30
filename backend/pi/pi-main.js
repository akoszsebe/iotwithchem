// load the pi ap module
const PiApp = require('./pi-app');

// load the Db module
const Db = require('../models/db');
const db = new Db();

// load the gateway module
const Gateway = require('./devices/gateway');
const gateway = new Gateway();

// Create new Temperature Device
const TemperatureDevice = require('./devices/temperature.device');
const temperaturedevice = new TemperatureDevice;

//  Create new HeatSource Device
const HeatSourceDevice = require('./devices/heatsource.device');
const heatsourcedevice = new HeatSourceDevice();

//  Create new PH Device
const PhDevice = require('./devices/ph.device');
const phdevice = new PhDevice();

// Create new PumpDevice
const PumpDevice = require('./devices/pump.device');
const pumpdevice = new PumpDevice();

// Create new Sensor Values Context
const SensorValueContext = require('../models/sensor-value-context');
const sensorValueContext = new SensorValueContext();

// Create new Message Queue pi -> webservice
const MQueuePi = require('../communication/mqueue-pi');
const mQueuePi = new MQueuePi(sensorValueContext);

// create a new instance
// with the exernal dependencies
// db, devices, gateway
const piapp = new PiApp(db, temperaturedevice, heatsourcedevice, phdevice, pumpdevice, gateway, mQueuePi);

// Initialize the pi app
piapp.init();
// start the event loop of the pi app
piapp.setEventLoop();


