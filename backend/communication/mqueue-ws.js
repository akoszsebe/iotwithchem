'use strict';


/**
 * Class to handle the communication
 * webservice  toward gateway
 * via messagequeue
 */
const MQueueWS = module.exports = function (io) {

  this.qR = 'qToRaspberry';
  this.qW = 'qToWebserver';
  this.channel = null;
  this.heatertemperature = 0;
  this.pumpValue = 1;
  this.io = io;
  this.deviceList = [];
  // somewhere else to put?
  this.init()
};

/**
 * initialize the communocation chanel and
 * set some initial parametes values
 */
MQueueWS.prototype.init = function () {

  this.cloudAmqpUrl = 'amqp://fiynopcz:fYBzRHfKTa-dcH8bgMo4WtTg5iPkpUa-@hare.rmq.cloudamqp.com/fiynopcz';
  const self = this;
  this.open = require('amqplib').connect(self.cloudAmqpUrl).then(function (conn) {
    let ok = conn.createChannel();
    ok.then(function (ch) {
      self.channel = ch;
      console.info("channel created");
      self.receivemsgfromRaspberry()
    });
  }).then(null, console.warn);
  this.io.on('connection', (socket) => {
    console.log('The user is connected');
    self.deviceList.length > 0 ? self.io.emit('pi connected', true) : self.io.emit('pi disconnected', false);

    socket.on('disconnect', function () {
      console.log('The user is disconnected');
      if (self.deviceList.indexOf(socket) > -1) {
        self.io.emit('pi disconnected', false);
        self.deviceList.splice(self.deviceList.indexOf(socket), 1);
      }
    });
    socket.on('new pi', function () {
      console.log('New pi connected');
      self.deviceList.push(socket);
      self.io.emit('pi connected', true);
    })
  });

};


/**
 * Send message to teh Gateway (PI)
 */
MQueueWS.prototype.sendmsgtoRaspberry = function (msg) {
  // send meaasge
  this.channel.assertQueue(this.qR);
  this.channel.sendToQueue(this.qR, new Buffer(msg))
};

/**
 * Received message from teh  Gateway (PI)
 */
MQueueWS.prototype.receivemsgfromRaspberry = function () {
  const self = this;
  this.channel.assertQueue(this.qW);
  this.channel.consume(this.qW, function (msg) {
    if (msg !== null) {
      self.MessageRouting(msg.content.toString());
      self.channel.ack(msg);
    }
  });
};


/**
 * Routing the income messages
 */
MQueueWS.prototype.MessageRouting = function (message) {
  const splitMessage = message.split(':');
  switch (splitMessage[0]) {
    case 'Heater':
      switch (splitMessage[1]) {
        case 'ON':
          this.io.emit('heaterStatusChange', true);
          break;
        case 'OFF':
          this.io.emit('heaterStatusChange', false);
          break;
      }
      break;
    case 'Pump':
      switch (splitMessage[1]) {
        case 'ON':
          this.io.emit('pumpStatusChange', true);
          break;
        case 'OFF':
          this.io.emit('pumpStatusChange', false);
          break;
      }
      break;
  }
};


MQueueWS.prototype.getDeviceStatus = function (_callback) {
  return _callback(this.deviceList.length > 0);
};
