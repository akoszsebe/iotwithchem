'use strict';

let path = require('path');

const DbWs = require(path.resolve('backend/models/db-ws'));
const db = new DbWs();
/* Create new Message Queue  webservice -> pi*/

const MQueueWS = require(path.resolve('backend/communication/mqueue-ws'));

const Mail = require(path.resolve('backend/communication/mail'));
const mail = new Mail();


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


  app.get('/getDeviceStatus', (req, res) => {
    mq.getDeviceStatus(status => {
      res.json({alive: status});
    })
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
    mq.sendmsgtoRaspberry('Temp:Value:' + req.body.heatertemp);
    db.getJob((job) => {
      job.heaterValue = req.body.heatertemp;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.heaterValue});
      });
    });
  });

  app.get('/getheatertemperature', (req, res) => {
    db.getJob((job) => {
      res.json({sensorSetValue: job.heaterValue});
    })
  });

  app.post('/settempuploadinterval', (req, res) => {
    let upinterval = req.body.upinterval;
    let sensorid = req.body.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    if (typeof upinterval === 'undefined') upinterval = '30000';
    mq.sendmsgtoRaspberry('Temp:UpInterval:' + sensorid + ':' + upinterval);
    db.getJob((job) => {
      job.tempReadInt = upinterval;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.tempReadInt});
      });
    });
  });


  app.post('/calibratephsensor', (req, res) => {
    mq.sendmsgtoRaspberry('Ph:Calibrate:' + req.body.level);
    res.json({sent: true})
  });

  app.post('/setphvalue', (req, res) => {
    mq.sendmsgtoRaspberry('Ph:Value:' + req.body.phValue);
    db.getJob((job) => {
      job.pumpValue = req.body.phValue;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.pumpValue});
      });
    });
  });

  app.get('/getphvalue', (req, res) => {
    db.getJob((job) => {
      res.json({sensorSetValue: job.pumpValue});
    })
  });

  app.post('/setphuploadinterval', (req, res) => {
    let upinterval = req.body.upinterval;
    let sensorid = req.body.sensorid;
    if (typeof sensorid === 'undefined') sensorid = '1';
    if (typeof upinterval === 'undefined') upinterval = '30';
    mq.sendmsgtoRaspberry('Ph:UpInterval:' + sensorid + ':' + upinterval);
    db.getJob((job) => {
      job.phReadInt = upinterval;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.phReadInt});
      });
    });
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
    db.getJob((job) => {
      res.json(job);
    })
  });

  app.post('/startjob', (req, res) => {
    db.getJob(function (job) {
      if (job.jobEndDate > (new Date()).getTime()) {
        mq.sendmsgtoRaspberry("Work:Stop");
      }
      setTimeout(() => {
        console.log('waiting to stop the previous job if there is any');
        db.getJob((job) => {
          job.jobStartDate = req.body.jobStartDate;
          job.jobEndDate = req.body.jobEndDate;
          job.jobDescription = req.body.jobDescription;
          mq.sendmsgtoRaspberry("Work:Start:" + (job.jobEndDate - job.jobStartDate) / 1000);
          db.setJob(job, (newJob) => {
            res.json(newJob);
          });
        });
      }, 5000);
    })
  });

  app.post('/stopjob', (req, res) => {

    mq.sendmsgtoRaspberry("Work:Stop");
    db.getJob(function (job) {
      if (job.jobEndDate > (new Date()).getTime()) {
        job.jobEndDate = (new Date()).getTime();
        db.setJob(job, (stoppedJob) => {
          res.json(stoppedJob);
        });
      } else {
        res.json(job);
      }
    });
  });

  app.post('/sendFeedback', (req, res) => {
    mail.sendMail(req.body.from, req.body.message);
    res.json({sent: true});
  });


  app.get('*', (req, res) => {
    res.sendFile(path.resolve('./dist/index.html'))
  })


};
