// server.js
var express = require('express');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var config = require('./config/config');

var pjson = require('../package.json');

var environment = process.env.NODE_ENV || 'development';

var app = express();
app.set('port', (process.env.PORT || 4201));

app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

console.log('dirname', __dirname);

// for email templates
app.set('view engine', 'ejs');
app.engine ('html', require('ejs').renderFile );

// Security
// http://nodesource.com/blog/nine-security-tips-to-keep-express-from-getting-pwned/

// https://www.ssllabs.com/ssltest/analyze.html?d=app.matchmaker420.com
var forceSSL = function() {
  return function (req, res, next) {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    console.log('process.API_URL', process.API_URL);
    if (process.env.NODE_ENV === 'production') {
      console.log('\nPRODUCTION < - - - -');
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(
          ['https://', req.get('Host'), req.url].join('')
        );
      }
    }
    next();
  }
};

app.use(forceSSL());

//
// cors
//
//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'charset, authorization, content-type');

  next();
};
app.use(allowCrossDomain);


var moment = require('moment');
var tz = require('moment-timezone');
// api authorization middleware
var checkCredentials = function(req, res, next) {
    var clients = config.apiPairs;
    var auth = req.header('Authorization').replace('Basic ', '').split(':');

    var rTime = '';
    for (var c = 2; c < auth.length; c++) {
        rTime += c > 2 ? ':' + auth[c] : auth[c];
    }
    console.log('rTime', rTime);

    var requestedTime = moment(rTime);
    var nowTZ = moment.tz(moment(), 'America/Los_Angeles');
    console.log('\nrequestedTime.format()', requestedTime.format());
    console.log('nowTZ.format()', nowTZ.format());

    var duration = moment.duration(nowTZ.diff(requestedTime));
    console.log('\nduration.asSeconds()', duration.asSeconds());

    var authorized = clients[auth[0]] === auth[1];
    var expired = duration.asSeconds() > 25;

    if (authorized && !expired) {
        console.log('\n+ + + + + Authorized + + + + +\n');
        next();
    } else {
        console.log('\n- - - - - Unauthorized or Expired - - - - -\n');
        res.send({error: 'Not Authorized or Expired'})
    }

};
app.use(checkCredentials);


console.log('process.env.npm_package_version:', process.env.npm_package_version);


//
// database
//
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGODB_URI ||
               process.env.MONGOHQ_URL ||
               process.env.MONGOLAB_PINK_URI ||
               'mongodb://localhost:27017/matchmaker420-api';
mongoose.connect(mongoUri);
// mongoose.connect('mongodb://localhost:27017/matchmaker420-dev');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// open connection to db
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('\n* * * * Connected to MongoDB at ' + mongoUri);

  // load api routes
  require('./api-routes')(app);

  // start up the server
  app.listen(app.get('port'), function() {

    console.log('* * * * App Version: ' + pjson.version);
    console.log('* * * * Matchmaker420 API is running on port ' + app.get('port') + ' in ' + environment + ' mode * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * \n');
    // console.log('* * * * Matchmaker420 initialized * * * *\n');
  });

});


app.post('/report-violation', function (req, res) {
  if (req.body) {
    console.log('CSP Violation: ', req.body)
  } else {
    console.log('CSP Violation: No data received!')
  }

  res.status(204).end()
});


module.exports = app;
