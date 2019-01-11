// server.js
var express = require('express');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var config = require('./config/config');

var pjson = require('../package.json');

require('./api/evercase-api');

var environment = process.env.NODE_ENV || 'development';

var app = express();
app.set('port', (process.env.PORT || config.app.port));

app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

console.log('dirname ', __dirname);

// for email templates
app.set('view engine', 'ejs');
app.engine ('html', require('ejs').renderFile );

// Security
// http://nodesource.com/blog/nine-security-tips-to-keep-express-from-getting-pwned/

// https://www.ssllabs.com/ssltest/analyze.html?d=app.evercase.space
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

// check api user credentials
var auth = require('./auth/auth')
app.use(auth.checkCredentials);


// run xlims cronjob
// var xlims = require('./jobs/xlims/fetch-xlims')
// if (environment === 'production') {
//   xlims.startJob()
// } else {
//   var t = setTimeout(() => xlims.startJob(), 3000)
// }


console.log('process.env.npm_package_version: ', process.env.npm_package_version);

//
// database
//
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGODB_URI ||
               process.env.MONGOHQ_URL ||
               process.env.MONGOLAB_PINK_URI ||
               `mongodb://localhost:${config.mongo.port}/${config.mongo.databaseName}`;
mongoose.connect(mongoUri);
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

    console.log(`* * * * App Version: ${pjson.version}`);
    console.log(`* * * * ${config.app.siteName} is running on port ${app.get('port')} in ${environment} mode * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * \n`);
    // console.log('* * * * Evercase initialized * * * *\n');
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
