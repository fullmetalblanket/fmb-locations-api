/**
 * Created by tyson on 2018/5/15/.
 */

var path = require('path');
var config = require('./config/config');
var env = require('./environments/environment');

module.exports = function(app) {

  // data routes
  require('./api/certification-type/certification-type.api')(app);
  require('./api/concentrate-type/concentrate-type.api')(app);
  require('./api/cultivation-environment/cultivation-environment.api')(app);
  require('./api/extraction-method/extraction-method.api')(app);
  require('./api/mailer/mailer.api')(app);
  require('./api/message/message.api')(app);
  require('./api/notification/notification.api')(app);
  require('./api/order/order.api')(app);
  require('./api/payment-type/payment-type.api')(app);
  require('./api/product-class/product-class.api')(app);
  require('./api/product-grow-method/product-grow-method.api')(app);
  require('./api/product-subscription/product-subscription.api')(app);
  require('./api/product-type/product-type.api')(app);
  require('./api/product-unit/product-unit.api')(app);
  require('./api/product/product.api')(app);
  require('./api/upload/upload.api')(app);
  require('./api/user-type/user-type.api')(app);
  require('./api/user/user.api')(app);

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
