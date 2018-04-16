var Notification = require('./notification.model');
var Product = require('../product/product.model');
var async = require('async');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/notifications_data', function(req, res) {
    console.log('\nProduct Types api: Tryna get notifications');
    Notification.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/notifications_data/count', function(req, res) {
    Notification.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/notifications_data', function(req, res) {
    console.log('Notification api: create', req.body);
    var obj = new Notification(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/notifications_data/:id', function(req, res) {
    Notification.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // find all by user id, populating product_subscription or message
  app.get('/notifications_data_by_user/:userID', function(req, res) {
    console.log('\nnotifications_data_by_user: req.params', req.params);

    Notification
      .find({user: req.params.userID})
      .populate({
        path: 'product_subscription',
        model: 'ProductSubscription',
        populate: {
          path:  'product',
          model: 'Product'
        }
      })
      .exec(function(err, docs){
        if (err) return handleError(err);
        res.json(docs);
      });

  });

  // unread notifications by user and read status
  app.get('/notifications_data_by_user_and_read_status/:userID/:status', function(req, res) {
    console.log('\nOrder api: get user orders by delivery status');
    console.log('id', req.params.userID);
    console.log('status', typeof req.params.status);
    const action = req.params.status==='true' ? {$exists: true, $ne: null} : {$exists: false};
    console.log('action', action);
    Notification.find({ user: req.params.userID, read: action }, function(err, docs) {
      if(err) return console.error(err);
      console.log('docs', docs);
      res.json(docs);
    });
  });

  // update by id
  app.put('/notifications_data/:id', function(req, res) {
    Notification.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/notifications_data/:id', function(req, res) {
    Notification.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
