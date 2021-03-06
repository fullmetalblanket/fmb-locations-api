// var moment = require('moment');
var moment = require('moment-timezone');
// var tz = require('moment-timezone');
var config = require('../config/config');

var checkCredentials = function(req, res, next) {
  var authorization = req.header('Api-Authorization');
  console.log('authorization req.headers',req.headers)
  console.log('api-authorization header',authorization)

  function isAuthorized() {
    console.log('\n+ + + + + API Authorized + + + + +\n');
    next();
  }

  function notAuthorized() {
    console.log('\n- - - - - Unauthorized or Expired - - - - -\n');
    res.send({error: 'Not Authorized or Expired'})
  }

  if (authorization) {
    // var clients = config.apiPairs;
    var clients = config.apiClients;
    var auth = authorization.replace('Basic ', '').split(':');
  
    var rTime = '';
    for (var c = 2; c < auth.length; c++) {
        rTime += c > 2 ? ':' + auth[c] : auth[c];
    }
    // console.log('rTime', rTime);
  
    var requestedTime = moment(rTime);
    var nowTZ = moment.tz(moment(), 'America/Los_Angeles');
    // console.log('\nrequestedTime.format()', requestedTime.format());
    // console.log('nowTZ.format()', nowTZ.format());
  
    var duration = moment.duration(nowTZ.diff(requestedTime));
    // console.log('\nduration.asSeconds()', duration.asSeconds());
  
    // var authorized = clients[auth[0]] === auth[1];
    var authorized = clients.find(c => c.key === auth[0] && c.secret === auth[1]);
    // var expired = duration.asSeconds() > 30;
    var expired = false;
  
    if (authorized && !expired) {
      console.log('Authorized:',authorized.name)
      isAuthorized();
    } else {
      console.log('Unauthorized:',auth)
      notAuthorized();
    }
  } else {
    notAuthorized();
  }

};

module.exports.checkCredentials = checkCredentials