'use strict'

let express = require('express'),
  app = express(),
  // Configuring Passport
  passport = require('passport'),
  expressSession = require('express-session')

// set port
app.set('port', process.env.PORT || 8081)

app.use(express.static(__dirname + '/dist'))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next()
})

// run
app.listen(app.get('port'), () => {
  console.info('App is running on port ', app.get('port'))
})

exports = module.exports = app

app.use(expressSession({secret: 'mySecretKey', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

let initPassport = require('./backend/passport/init')
initPassport(passport)

// routing
require('./backend/routes')(app, passport)
