// server.js
var express = require('express');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var uuid = require('node-uuid')
// var favicon = require('serve-favicon');
var helmet = require('helmet');

var pjson = require('../package.json');

var environment = process.env.NODE_ENV || 'development';

var config = {
  useHelmet: false
};

var app = express();
app.set('port', (process.env.PORT || 4201));

// app.use('/', express.static(__dirname + '/../../dist'));

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


// https://helmetjs.github.io/docs/

// app.use(function (req, res, next) {
//   res.locals.nonce = uuid.v4();
//   // console.log('\nNONCE:', res.locals.nonce);
//   next();
// });

// function generateNonce(req, res, next) {
//   const rhyphen = /-/g;
//   res.locals.nonce = uuid.v4().replace(rhyphen, '');
//   next();
// }
//
// function getNonce(req, res) {
//   return 'nonce-' + res.locals.nonce;
// }

// Content Security Policy
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ['*.google-analytics.com'],
//     styleSrc: ["'unsafe-inline'"],
//     imgSrc: ['*.amazonaws.com'],
//     connectSrc: ["'none'"],
//     fontSrc: ['fonts.googleapis.com'],
//     objectSrc: ["'none'"],
//     mediaSrc: ["'none'"],
//     frameSrc: ["'none'"]
//   }
// }));


if (config.useHelmet) {
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'app.matchmaker420.com', 'localhost:4200'],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'", // TODO: need this to use google analytics but seems unsafe??
        "'unsafe-inline'",
        'www.google-analytics.com',
        'ajax.googleapis.com',
        // can't figure out how to use the nonce
        // function (req, res) {
        //   return "'nonce-" + res.locals.nonce + "'";
        // }
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", '*.amazonaws.com', 'www.google-analytics.com', 'data:'],
      connectSrc: ["'self'", '*.amazonaws.com', 'data:', 'www.google-analytics.com'],
      fontSrc: ['fonts.gstatic.com'],
      objectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  }));

  // app.use(function (req, res) {
  //   res.end('<input nonce="' + res.locals.nonce + '">');
  // });

  // XSS Filter
    app.use(helmet.xssFilter());

  // X-Frame: sameorigin
    app.use(helmet.frameguard('sameorigin'));

  // Implement Strict-Transport-Security
    app.use(helmet.hsts({
      maxAge: 7776000000,
      includeSubdomains: true
    }));

  // Hide X-Powered-By
    app.use(helmet.hidePoweredBy());
  // app.use(helmet.hidePoweredBy({ setTo: 'all your base are belong to us' }));
}




// app.get('/', function(req, res){
//   res.render('index.html', {
//     nonce: res.render.nonce
//   });
// });


// app.use(function(req, res, next) {
//   console.log('\n- - - - - > req.secure', req.secure);
//   if(!req.secure) {
//     console.log('\n- - - - - > Redirecting to HTTPS');
//     return res.redirect(['https://', req.get('Host'), req.url].join(''));
//   }
//   next();
// });

// function requireHTTPS(req, res, next) {
//   console.log('\n- - - - - > HTTPS?', req.secure);
//   // The 'x-forwarded-proto' check is for Heroku
//   if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
//     console.log('\n- - - - - > Redirecting to HTTPS');
//     return res.redirect('https://' + req.get('host') + req.url);
//   }
//   next();
// }
// app.use(requireHTTPS);

// var https_redirect = function(req, res, next) {
//   console.log('\n- - - - - > HTTPS?', req.secure);
//   console.log('- - - - - > process.env.NODE_ENV', process.env.NODE_ENV);
//   if (process.env.NODE_ENV === 'production') {
//     console.log('\n- - - - - > production');
//     console.log('- - - - - > req.secure', req.secure);
//     console.log('- - - - - > x-forwarded-proto', req.headers['x-forwarded-proto']);
//     if (req.headers['x-forwarded-proto'] != 'https') {
//       console.log('- - - - - > redirect to https host', req.headers.host);
//       console.log('- - - - - > redirect to https url', req.url);
//       return res.redirect('https://' + req.headers.host + req.url);
//     } else {
//       console.log('\n- - - - - > don\'t redirect to https');
//       return next();
//     }
//   } else {
//     console.log('\n- - - - - > development');
//     return next();
//   }
// };
//
// app.use(https_redirect);


// favicons and app icons
// app.use(favicon({
//   '/favicon.ico': __dirname + '/public/favicon.ico',
//   '/favicon-16x16.png': __dirname + '/public/favicon-16.png',
//   '/favicon-96x96.png': __dirname + '/public/favicon-96.png',
//   '/favicon-32x32.png': __dirname + '/public/favicon-152.png',
// }));


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
