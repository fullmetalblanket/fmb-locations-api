// var Mailer = require('./email.model.js');
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');

var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

const transporter = nodemailer.createTransport(ses({
  accessKeyId: 'AKIAI5T4NH77FNNFVTUQ',
  secretAccessKey: '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',
  region: 'us-west-2',
}));


// var appUrl = 'https://app.matchmaker420.com';
//
// if (process.env.NODE_ENV === 'development') {
//   appUrl = 'http://localhost:4200';
// }
// var os = require("os");
// var hostname = os.hostname();
// console.log('mailer.api hostname', hostname);
//
// if (hostname.indexOf('local') > -1) {
//   appUrl = 'http://localhost:4200';
// }
//
// if (hostname.indexOf('stage') > -1) {
//   appUrl = 'https://mm420-stage.herokuapp.com';
// }


// console.log('mailer.api appUrl', appUrl);



module.exports = function(app) {

  // APIs

  // send email to admin notifying of new user
  app.post('/send-new-user-email', function(req, res) {
    console.log('\n--> send-new-user-email');

    var html = 'New User: ' + req.body.email + '<br /><br />';
    html += 'Manage: ' + 'https://app.matchmaker420.com/admin/users;id=' + req.body._id + '<br /><br />';

    var mailOptions = {
      from: 'admin@matchmaker420.com',
      to: 'admin@matchmaker420.com',
      subject: 'New User Sign Up',
      html: html,
      text: html
    };

    transporter.sendMail(mailOptions).then(function (success) {
      console.log('new user sign up email sent success', success);
      res.json(success);
    });
  });


  // welcome email after signing up
  app.post('/send-welcome-email', function(req, res) {
    console.log('\n--> send-welcome-email');
    console.log('send-welcome-email: body',req.body);

    var templateDir = path.join(__dirname, 'templates', 'welcome-email');
    var sendWelcomeEmail = new EmailTemplate(templateDir);

    // var activationURL = 'https://app.matchmaker420.com/login;email=' + req.body.email + ';token='+ req.body.activation_token;
    var activationURL = 'https://app.matchmaker420.com/login;email=' + req.body.email;

    sendWelcomeEmail.render({
        name: req.body.administrator && req.body.administrator.administrator_name || req.body.email,
        activationURL: activationURL
      }, function (err, result) {
      console.log('send-welcome-email: result', result.text);
      console.log('send-welcome-email: html', result.html);
      if (err) return next(err);

      var mailOptions = {
        from: 'admin@matchmaker420.com',
        to: req.body.email,
        subject: 'Welcome to Matchmaker420',
        html: result.html,
        text: result.text,
        forceEmbeddedImages: true
      };

      transporter.sendMail(mailOptions).then(function (success) {
        console.log('welcome email sent success', success);
        res.json(success);
      });
    });
  });


  // reset password email
  app.post('/send-reset-password-email', function(req, res) {
    console.log('\nsend reset password params',req.params);
    console.log('send reset password body',req.body);

    var templateDir = path.join(__dirname, 'templates', 'reset-password');
    var sendResetPasswordEmail = new EmailTemplate(templateDir);

    // TODO: get token from req.body.tokennpm run dev

    // 'https://app.matchmaker420.com/reset-password;email=something@something.com;token=iwYicy27wtAmBHIvuH0A5aTdTeE4MeeRVq68uy2Igq5sCT5qBuY9C7Bw9ophqde7'
    var resetURL = 'https://app.matchmaker420.com/reset-password;email=' + req.body.email + ';token=' + req.body.token;

    sendResetPasswordEmail.render({
      name: req.body.email,
      resetURL: resetURL
    }, function (err, result) {
      console.log('send-success-email: result', result.text);
      console.log('send-success-email: html', result.html);
      if (err) return next(err);

      var mailOptions = {
        from: 'admin@matchmaker420.com',
        to: req.body.email,
        subject: 'Matchmaker420: reset password',
        html: result.html,
        text: result.text,
        attachments: [{
          filename: 'mm420-logo-white-solid.jpg',
          path: 'https://s3-us-west-1.amazonaws.com/matchmaker420/default/mm420-logo-white-solid.jpg',
          cid: 'logo@matchmaker420.com'
        }]
        // forceEmbeddedImages: true
      };

      transporter.sendMail(mailOptions).then(function (success) {
        console.log('email sent success', success);
        res.json(success);
      });
    });
  });

  // TODO: try to use user's email first, fallback to admin@matchmaker if fail
  // send feedback email (no template)
  app.post('/send-feedback-email', function(req, res) {
    console.log('\n--> send-feedback-email');
    // console.log('send-feedback-email: body',req.body);

    // var appData = JSON.parse(req.body);
    var appData = req.body;
    console.log('appData: email', appData.contactFormData.email);

    var html = 'Name: ' + appData.contactFormData.name + '<br /><br />';
    html += 'Email: ' + appData.contactFormData.email + '<br /><br />';
    html += 'Message: ' + appData.contactFormData.message + '<br /><br /><br />';
    html += 'appData: <br />' + JSON.stringify(req.body, null, 2);

    // from: appData.contactFormData.email, // amazon may reject some emails, use admin@matchmaker420.com
    var mailOptions = {
      // from: 'admin@matchmaker420.com',
      from: appData.contactFormData.email,
      to: 'admin@matchmaker420.com',
      subject: 'Feedback Form Submission',
      html: html,
      text: JSON.stringify(req.body, null, 2)
    };

    // transporter.sendMail(mailOptions).then(function (success) {
    //   console.log('feedback email sent success', success);
    //   res.json(success);
    // }).catch(function(error) {
    //   console.log('feedback email error', error);
    //
    // });

    var tries = 0;
    function sendEmail() {
      transporter.sendMail(mailOptions).then(function (success) {
        console.log('feedback email sent success', success);
        res.json(success);
      }).catch(function(error) {
        console.log('feedback email error', error);
        if (tries <= 2) {
          mailOptions.from = 'admin@matchmaker420.com';
          sendEmail();
        } else {
          res.json({error:'could not send email'});
        }
      });
    }

    sendEmail();
  });


  // order email
  app.post('/send-order-email', function(req, res) {
    console.log('\n--> send-order-email');
    // // console.log('send-order-email: body',req.body);
    // console.log('send-order-email: sellerEmail',req.body.sellerEmail);
    // // console.log('send-order-email: order',req.body.order);
    // console.log('send-order-email: order.shipping_address',req.body.order.shipping_address.nickname);

    var order = req.body;
    console.log('\nsend-order-email: order', order);

    var templateDir = path.join(__dirname, 'templates', 'order-email');
    var sendOrderEmail = new EmailTemplate(templateDir);

    var sendTo = order.orderType && order.orderType === 'seller' ? order.sellerEmail : order.buyerEmail;

    var appUrl = order.appURL || 'https://app.matchmaker420.com';

    sendOrderEmail.render({
      order: order,
      appUrl: appUrl
    }, function (err, result) {
      // console.log('send-welcome-email: result', result.text);
      // console.log('send-welcome-email: html', result.html);
      if (err) return next(err);

      console.log('send-order-email: sendTo', sendTo);

      var mailOptions = {
        from: 'admin@matchmaker420.com',
        to: sendTo,
        subject: 'Matchmaker420: Order has been placed',
        html: result.html,
        text: result.text,
        forceEmbeddedImages: true
      };

      transporter.sendMail(mailOptions).then(function (success) {
        console.log('welcome email sent success', success);
        res.json(success);
      });
    });
  });


  // send coming soon page was hit email (no template)
  app.post('/coming-soon-email', function(req, res) {
    console.log('\n--> coming-soon-email');

    var appData = req.body;

    var html = '<strong>' + appData.message + '</strong><br /><br />';
    html += '<strong>date:</strong> ' + new Date(appData.date) + '<br /><br />';
    html += '<strong>device:</strong> ' + appData.deviceInfo.device + '<br /><br />';
    html += '<strong>browser:</strong> ' + appData.deviceInfo.browser + '<br />';
    html += '<strong>browser version:</strong> ' + appData.deviceInfo.browser_version + '<br /><br />';
    html += '<strong>os:</strong> ' + appData.deviceInfo.os + '<br />';
    html += '<strong>os version:</strong> ' + appData.deviceInfo.os_version + '<br /><br />';
    html += '<strong>user agent:</strong> ' + appData.deviceInfo.userAgent + '<br /><br />';
    html += '<i><strong>deviceInfo:</strong> ' + JSON.stringify(appData.deviceInfo, null, 2) + '</i><br /><br />';
    html += '<strong>user:</strong> ' + JSON.stringify(appData.user, null, 2) + '<br /><br />';
    html += '<strong>cart:</strong> ' + JSON.stringify(appData.cart, null, 2) + '<br /><br />';
    html += '<i><strong>appData:</strong> <br />' + JSON.stringify(req.body, null, 2) + '</i>';
    // var html = 'appData - : <br />' + JSON.stringify(req.body, null, 2);

    console.log('\nemail html: ', html);

    var mailOptions = {
      from: 'admin@matchmaker420.com',
      to: 'admin@matchmaker420.com',
      subject: 'Coming Soon Data',
      html: html,
      text: JSON.stringify(req.body, null, 2)
    };

    transporter.sendMail(mailOptions).then(function (success) {
      console.log('coming soon email sent success', success);
      res.json(success);
    });
  });

};
