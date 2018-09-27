const config = require('../config/config');
const moment = require('moment');
const tz = require('moment-timezone');
const localtunnel = require('localtunnel');
let tunnel = null;

// var apiUrl = 'https://api.matchmaker420.com';
// var apiUrl = 'https://mm420-api-stage.herokuapp.com';
let apiUrl = process.env.MM420_API_URL;
console.log('* * * * apiUrl A ',apiUrl);

function createLocalTunnel() {
  tunnel = localtunnel(4201, function(err, tunnel) {
    if (err) {
      console.log('mm420-api big ol error ',err);
    }
    console.log('* * * * mm420-api createLocalTunnel tunnel.url', tunnel.url);
    apiUrl = tunnel.url
  });
  tunnel.on('close', function() {
    console.log('mm420-api TUNNEL HAS CLOSED!!!')
  });
};
if (!apiUrl && !tunnel) {
  createLocalTunnel();
} else {
  console.log('* * * * mm420-api apiUrl',apiUrl);
}

exports.requestOptions = function(params, body, queryParams) {
  const requestUrl = apiUrl + params.url;
  console.log('\nmm420-api requestUrl',requestUrl);
  const nowTZ = moment.tz(moment(),'America/Los_Angeles');
  console.log('mm420-api nowTZ.format() ',nowTZ.format());

  const authorization = new Buffer(config.mm420Api.apiKey + ':' + config.mm420Api.apiSecret + ':' + nowTZ.format());
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
