'use strict';
const nodemailer = require('nodemailer');


const Mail = module.exports = function () {
  // create reusable transporter object using the default SMTP transport
  this.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iotwithchem@gmail.com',
      pass: 'iotwithchem2016'
    }
  });
};


Mail.prototype.sendMail = function (from, message) {

  // setup email data with unicode symbols
  let mailOptions = {
    from: 'iotwithchem@gmail.com', // sender address
    to: 'kelemenisty@gmail.com', // list of receivers
    subject: 'Feedback from ' + from, // Subject line
    text: message, // plain text body
  };

  // send mail with defined transport object
  this.transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

};


