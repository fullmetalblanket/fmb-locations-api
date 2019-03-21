const config = require('../config/config');
const moment = require('moment');
// const tz = require('moment-timezone');
// const localtunnel = require('localtunnel');
const port = config.app.port
// const ngrok = require('ngrok')
let tunnel = null;

let apiUrl = process.env.EVERCASE_API_URL;
// var apiUrl = 'https://api.evercase.space'; // for local dev
// var apiUrl = 'https://api-stage.evercase.space'; // for local dev
console.log('* * * * apiUrl A ',apiUrl);

async function createLocalTunnel() {
    const ngrok = require('ngrok')
  // return new Promise(async (resolve, reject) => {
    console.log('port',port)
    const url = await ngrok.connect(port)
    apiUrl = url;
    // resolve(url)
  // });
  // tunnel = localtunnel(config.app.port, function(err, tunnel) {
  //   if (err) {
  //     console.log('fmb-locations-api big ol error ',err);
  //   }
  //   console.log('* * * * fmb-locations-api createLocalTunnel tunnel.url', tunnel.url);
  //   apiUrl = tunnel.url
  // });
  // tunnel.on('close', function() {
  //   console.log('fmb-locations-api TUNNEL HAS CLOSED!!!')
  // });
};
if (!apiUrl && !tunnel) {
  createLocalTunnel();
} else {
  console.log('* * * * local-api apiUrl',apiUrl);
}

exports.requestOptions = function(params, body, queryParams) {
  const requestUrl = apiUrl + params.url;
  console.log('\nlocal-api requestUrl',requestUrl);
  const nowTZ = moment.tz(moment(),'America/Los_Angeles');
  console.log('local-api nowTZ.format() ',nowTZ.format());

  const authorization = new Buffer(config.fmbLocationsApi.apiKey + ':' + config.fmbLocationsApi.apiSecret + ':' + nowTZ.format());
  const options = {
    url: requestUrl,
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Basic ' + authorization,
      'Api-Authorization': 'Basic ' + authorization
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
