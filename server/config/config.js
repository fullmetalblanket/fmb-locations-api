var config = require('./config.json');
module.exports = config;

var jwt = require('express-jwt');

var config = {};

config.noConsole = true;

// jwt token generation
config.tokenSecret = '1 w1ll n07 f34r. f34r 15 7h3 m1ndk1ll3r.';
config.sessionExpiresIn = 72000; // was 7200
// jwt token auth check
config.authCheck = jwt({
  // secret: new Buffer('06NWHN1lmw3kFFlMgpukE2TutVDX5YLPe_GXo3i_sN939QVcQsm39EES8jdDWOac', 'base64'),
  secret: '06NWHN1lmw3kFFlMgpukE2TutVDX5YLPe_GXo3i_sN939QVcQsm39EES8jdDWOac',
  audience: 'BGbvkbkLrV5wxBROxr5xSGh5RLsk3yhF'
});

// image uploads Amazon aws
config.AWSConfig = {
  accessKey: 'AKIAI5T4NH77FNNFVTUQ',
  bucketKey: 'AKIAJPU3NGP7PUK6XTNA',
  secretAccessKey: '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',
  bucket: process.env.AWS_BUCKET || 'matchmaker420',
  acl: 'public-read-write',
  AWSAccountID: '6631-8908-0904',
  CanonicalUserID: '3f69f68fd6d919a58e6aa3cb6108e280e9c848103becf0910013b7fa39c4cd8c',
  region: 'us-west-1',
};

// mongo express config for reference,
// must be set in node_modules/mongo-express/config.js (make a copy of config.default.js)
// you will need to do the above if you reinstall node_modules
config.mongoExpressConfig = {
  db:       'matchmaker420-api',
  host:     'localhost',
  password: 'pass',
  port:     27017,
  ssl:      false,
  url:      'mongodb://localhost:27017/matchmaker420-api',
  username: 'admin',
};

config.apiPairs = {
  'appTemplate':'appTemplate',
  '1234567890':'0987654321', // matchmaker420 app
  '0987654321':'1234567890' // cb labs
};

config.apiUsers = {

};

module.exports = config;
