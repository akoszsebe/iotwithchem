'use strict';
let FacebookStrategy = require('passport-facebook').Strategy;
let User = require('../models/users');
let fb = require('fb');
module.exports = (passport) => {
  passport.use('facebook', new FacebookStrategy({
      //clientID: '323023344746285',
      //clientSecret: 'ebdb4703aed8f6812d51be129cef8ce2',
      //callbackURL: 'http://localhost:8081/login/facebook/return',
      clientID: '190103424780365',
      clientSecret: '6f2b8d730b04ae86285aac21bbfe1e41',
      callbackURL: 'https://iotwithchem2.herokuapp.com/login/facebook/return',
      profileFields: ['id', 'name', 'link', 'about', 'email', 'photos']
    },
    // facebook will send back the tokens and profile
    (access_token, refresh_token, profile, done) => {
      //console.log('profile', profile)
      process.nextTick(() => {
        fb.api('/687797544718797/members?access_token=' + access_token, (response) => {
          if (response.error) return done(response.error);
          if (response) {
            let isMember = false;
            response.data.forEach((user) => {
              if (user.id === profile.id) {
                isMember = true;

                User.findOne({
                  'fb.id': profile.id
                }, (err, user) => {
                  if (err) {
                    console.log(err);
                    return done(err)
                  } else if (user) {
                    console.log('exists in the db');
                    return done(null, user)
                  } else {
                    let newUser = new User();
                    newUser.fb.id = profile.id;
                    newUser.fb.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.fb.email = profile.emails[0].value;
                    newUser.fb.picUrl = profile.photos[0].value;
                    newUser.save(function (err) {
                      if (err) {
                        throw err
                      } else {
                        return done(null, newUser)
                      }
                    });
                  }
                });
              }
            });
            if (!isMember) {
              return done(null, false)
            }
          }
        });
      });
    }));
};
