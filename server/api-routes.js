/**
 * Created by tyson on 2018/5/15/.
 */

// var path = require('path');
// var config = require('./config/config');
// var env = require('./environments/environment');

module.exports = function(app) {

  // data routes
  require('./api/country/country.api')(app);
  require('./api/state/state.api')(app);
  require('./api/city/city.api')(app);

  // get app version from server
  app.get('/app_version', function(req, res) {
    res.json({version: process.env.npm_package_version});
  });

  // don't let those shitty bots in
  app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
  });

  console.log('* * * * api-routes locked and loaded');

  // app.use(function (err, req, res, next) {
  //   if (err.name === 'UnauthorizedError') {
  //     // res.status(401).send('invalid token...');
  //     // console.log('redirecting invalid token to',path.join(__dirname,'/../../dist/index.html'));
  //     // res.sendFile(path.join(__dirname,'/../../dist/index.html'));
  //     console.log('x x x x unauthorized error');
  //   }
  // });

  app.use(function(req, res) {
      res.status(404).send({url: req.originalUrl + ' not found'})
  });

};
