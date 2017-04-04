'use strict';

let path = require('path');
/*
 db = require(path.resolve('backend/models/downloadData.js')),
 mq = require(path.resolve('backend/models/messagequeue.js'))


 Create DB WS
 */

const DbWs = require(path.resolve('backend/models/db-ws'));
const db = new DbWs();
/* Create new Message Queue  webservice -> pi*/

const MQueueWS = require(path.resolve('backend/communication/mqueue-ws'));
const mq = new MQueueWS();

const Mail = require(path.resolve('backend/communication/mail'));
const mail = new Mail();

/* ********
 * REVIEW requested by LASZLO  : END
 * **********
 */

let raspiAlive = false;
let time = 0;

module.exports = (app, passport, io) => {

  io.on('connection', (socket) => {
    console.log('The user is connected');
    socket.on('disconnect', function () {
      console.log('The user is disconnected');
    });
  });


  app.get('/getsensorids', (req, res) => {
    db.getTemperatureSensors(function (returndata) {
      res.json(returndata)
    })
  });


  app.get('/gettemperature', (req, res) => {
    let sensorid = req.query.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    db.getTemperature(sensorid, function (returndata) {
      res.json(returndata)
    })
  });


  app.get('/gettemperatureinterval', (req, res) => {
    let sensorid = req.query.sensorid;
    let datefrom = req.query.datefrom;
    let dateto = req.query.dateto;
    if (typeof sensorid === 'undefined') sensorid = '1';
    db.getTemperatureInterval(sensorid, datefrom, dateto, function (returndata) {
      res.json(returndata)
    })

  });

  app.get('/getph', (req, res) => {
    let sensorid = req.query.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    db.getPh(sensorid, function (returndata) {
      res.json(returndata)
    })
  });


  app.get('/getphinterval', (req, res) => {
    let sensorid = req.query.sensorid;
    const datefrom = req.query.datefrom;
    const dateto = req.query.dateto;
    if (typeof sensorid === 'undefined') sensorid = '1';
    db.getPhInterval(sensorid, datefrom, dateto, function (returndata) {
      res.json(returndata)
    })
  });


  app.get('/isalive', (req, res) => {
    res.json({alive: raspiAlive})
  });

  app.get('/login/facebook',
    passport.authenticate('facebook', {scope: ['email']}));

  app.get('/login/facebook/return',
    passport.authenticate('facebook', {failureRedirect: '/login', scope: ['email']}),
    (req, res) => {
      res.redirect('/experiment')
    });


  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login')
  });

  app.get('/checkAuth', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({'user': req.user.fb});
    } else {
      res.json({'user': null})
    }
  });

  app.get('/setheateron', function (req, res) {
    io.emit('heaterStatusChange', req.query.isOn);
    res.sendStatus(200);
  });

  app.get('/setheateroff', function (req, res) {
    res.json({heater: false})
  });

  app.get('/setpumpon', function (req, res) {
    time = new Date();
    io.emit('pumpStatusChange', req.query.isOn);
    // mq.sendmsgtoRaspberry('Pump:ON');
    res.sendStatus(200);
  });
  app.get('/setpumpoff', function (req, res) {
    time = new Date() - time;
    // mq.sendmsgtoRaspberry('Pump:OFF');
    res.sendStatus(200);
  });

  app.post('/setheatertemperature', function (req, res) {
    mq.sendmsgtoRaspberry('Heater:Temperature:' + req.body.heatertemp);
    mq.getHeaterTemperature(function (returndata) {
      res.json({heatertemperature: returndata})
    })
  });

  app.get('/getheatertemperature', function (req, res) {
    mq.getHeaterTemperature(function (returndata) {
      res.json({heatertemperature: returndata})
    })
  });

  app.post('/settemperaturesensorsuploadinterval', function (req, res) {
    let upinterval = req.body.upinterval;
    console.log(upinterval);
    let sensorid = req.body.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    if (typeof upinterval === 'undefined') upinterval = '30000';
    mq.sendmsgtoRaspberry('Sensor:UpInterval:' + sensorid + ':' + upinterval);
    res.json({sent: true})
  });


  app.get('/calibratephsensorlow', function (req, res) {
    mq.sendmsgtoRaspberry('Ph:Calibrate:Low');
    res.json({sent: true})
  });

  app.get('/calibratephsensormid', function (req, res) {
    mq.sendmsgtoRaspberry('Ph:Calibrate:Mid');
    res.json({sent: true})
  });

  app.get('/calibratephsensorhigh', function (req, res) {
    mq.sendmsgtoRaspberry('Ph:Calibrate:High');
    res.json({sent: true})
  });

  app.post('/setphvalue', function (req, res) {
    mq.sendmsgtoRaspberry('Ph:Value:' + req.body.phvalue);
    res.json({sent: true})
  });

  app.get('/getOldestReadDates', function (req, res) {
    let sensorid = req.params.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    db.getOldestTemp(sensorid, function (temp) {
      db.getOldestPh(sensorid, function (ph) {
        res.json({temp: temp.tempdate, ph: ph.phdate});
      });
    });
  });

  app.get('/getJob', function (req, res) {
    db.getJob(function (job) {
      res.json(job);
    })
  });

  app.post('/setJob', function (req, res) {
    let newJob = {
      jobStartDate: req.body.jobStartDate,
      jobEndDate: req.body.jobEndDate,
      jobDescription: req.body.jobDescription
    };
    db.setJob(newJob, function (job) {
      res.json(job);
    })
  });

  app.post('/sendFeedback', function (req, res) {
    mail.sendMail(req.body.from, req.body.message);
    res.json({sent: true});
  });


  app.get('*', (req, res) => {
    res.sendFile(path.resolve('./dist/index.html'))
  })


};

setInterval(() => {
  db.getPulse((returndata) => {
      raspiAlive = returndata
    }
  )
}, 3000);
