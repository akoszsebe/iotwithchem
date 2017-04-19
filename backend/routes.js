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

const Mail = require(path.resolve('backend/communication/mail'));
const mail = new Mail();

/* ********
 * REVIEW requested by LASZLO  : END
 * **********
 */

let raspiAlive = false;
let time = 0;

module.exports = (app, passport, io) => {

  const mq = new MQueueWS(io);

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
    req.isAuthenticated() ? res.json({'user': req.user.fb}) : res.json({'user': null});
  });

  app.post('/setheatertemperature', (req, res) => {
    mq.sendmsgtoRaspberry('Heater:Temperature:' + req.body.heatertemp);
    mq.getHeaterTemperature(function (returndata) {
      res.json({heatertemperature: returndata})
    })
  });

  app.get('/getheatertemperature', (req, res) => {
    mq.getHeaterTemperature(function (returndata) {
      res.json({sensorSetValue: returndata})
    })
  });

  app.post('/settemperaturesensorsuploadinterval', (req, res) => {
    let upinterval = req.body.upinterval;
    console.log(upinterval);
    let sensorid = req.body.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    if (typeof upinterval === 'undefined') upinterval = '30000';
    mq.sendmsgtoRaspberry('Sensor:UpInterval:' + sensorid + ':' + upinterval);
    res.json({sent: true})
  });


  app.post('/calibratephsensor', (req, res) => {
    mq.sendmsgtoRaspberry('Ph:Calibrate:' + req.body.level);
    res.json({sent: true})
  });

  app.post('/setphvalue', (req, res) => {
    mq.sendmsgtoRaspberry('Ph:Value:' + req.body.phValue);
    mq.getPumpValue((returndata) => {
      res.json({sensorSetValue: returndata});
    })
  });

  app.get('/getphvalue', (req, res) => {
    mq.getPumpValue((returndata) => {
      res.json({sensorSetValue: returndata});
    })
  });

  app.get('/getOldestReadDates', (req, res) => {
    let sensorid = req.params.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    db.getOldestTemp(sensorid, function (temp) {
      db.getOldestPh(sensorid, function (ph) {
        res.json({temp: temp.tempdate, ph: ph.phdate});
      });
    });
  });

  app.get('/getJob', (req, res) => {
    db.getJob(function (job) {
      res.json(job);
    })
  });

  app.post('/setJob', (req, res) => {
    const newJob = {
      jobStartDate: req.body.jobStartDate,
      jobEndDate: req.body.jobEndDate,
      jobDescription: req.body.jobDescription
    };
    db.setJob(newJob, function (job) {
      res.json(job);
    })
  });

  app.post('/sendFeedback', (req, res) => {
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
