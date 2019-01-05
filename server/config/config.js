var jwt = require('express-jwt');
var config = require('./config.json');

// jwt token generation
config.tokenSecret = '1 w1ll n07 f34r. f34r 15 7h3 m1ndk1ll3r.';

// was 7200 (2h), 72000 (20h), 1209600 (14d), 2592000 (30d), 15778476 (6mo)
config.sessionExpiresIn = {
  user: 1209600,
  admin: 15778476
}; 

// jwt token auth check
config.authCheck = jwt({
  // secret: new Buffer('06NWHN1lmw3kFFlMgpukE2TutVDX5YLPe_GXo3i_sN939QVcQsm39EES8jdDWOac', 'base64'),
  secret: '06NWHN1lmw3kFFlMgpukE2TutVDX5YLPe_GXo3i_sN939QVcQsm39EES8jdDWOac',
  audience: 'BGbvkbkLrV5wxBROxr5xSGh5RLsk3yhF'
});

module.exports = config;