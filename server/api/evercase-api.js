const config = require('../config/config');
const moment = require('moment');
const tz = require('moment-timezone');
const localtunnel = require('localtunnel');
let tunnel = null;

let apiUrl = process.env.EVERCASE_API_URL;
// var apiUrl = 'https://api.evercase.space'; // for local dev
// var apiUrl = 'https://api-stage.evercase.space'; // for local dev
console.log('* * * * apiUrl A ',apiUrl);

function createLocalTunnel() {
  tunnel = localtunnel(config.app.port, function(err, tunnel) {
    if (err) {
      console.log('evercase-api big ol error ',err);
    }
    console.log('* * * * evercase-api createLocalTunnel tunnel.url', tunnel.url);
    apiUrl = tunnel.url
  });
  tunnel.on('close', function() {
    console.log('evercase-api TUNNEL HAS CLOSED!!!')
  });
};
if (!apiUrl && !tunnel) {
  createLocalTunnel();
} else {
  console.log('* * * * evercase-api apiUrl',apiUrl);
}

exports.requestOptions = function(params, body, queryParams) {
  const requestUrl = apiUrl + params.url;
  console.log('\nevercase-api requestUrl',requestUrl);
  const nowTZ = moment.tz(moment(),'America/Los_Angeles');
  console.log('evercase-api nowTZ.format() ',nowTZ.format());

  const authorization = new Buffer(config.evercaseApi.apiKey + ':' + config.evercaseApi.apiSecret + ':' + nowTZ.format());
  const options = {
    url: requestUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + authorization
    }
  };

  if (queryParams) {
    options.qs = queryParams;
  }

  if (body) {
    options.body = body;
    options.json = true;
  }

  return options;
};
