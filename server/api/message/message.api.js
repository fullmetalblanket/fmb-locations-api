var Message = require('./message.model');
var Product = require('../product/product.model');
var User = require('../user/user.model');
var async = require('async');

const populateOptions = [
  {
    path: 'product_subscription',
    model: 'ProductSubscription',
    populate: {
      path:  'product',
      model: 'Product'
    }
  },
  {
    path: 'from',
    model: 'User'
  }
];

module.exports = function(app) {

  // APIs

  // select all
  app.get('/messages_data', function(req, res) {
    console.log('\nProduct Types api: Tryna get messages');
    Message.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/messages_data/count', function(req, res) {
    Message.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/messages_data', function(req, res) {
    console.log('Message api: create', req.body);
    var obj = new Message(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/messages_data/:id', function(req, res) {
    // Message.findOne({_id: req.params.id}, function(err, obj) {
    //   if(err) return console.error(err);
    //   res.json(obj);
    // })

    Message.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      Message.populate(obj, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        console.log('Returning ' + docs.length + ' products');
        res.status(200).json(docs);
      });
    });
  });

  // find all by user id, populating product_subscription or from user
  app.get('/messages_data_by_user/:userID', function(req, res) {
    console.log('\nmessages_data_by_user: req.params', req.params);
    Message
      .find({user: req.params.userID})
      .populate(populateOptions)
      .exec(function(err, docs){
        if (err) return handleError(err);
        res.json(docs);
      });
  });

  // unread messages by user and read status
  app.get('/messages_data_by_user_and_read_status/:userID/:status', function(req, res) {
    console.log('\nOrder api: get user orders by delivery status');
    console.log('id', req.params.userID);
    console.log('status', typeof req.params.status);
    const action = req.params.status==='true' ? {$exists: true, $ne: null} : {$exists: false};
    console.log('action', action);
    Message.find({ user: req.params.userID, read: action }, function(err, docs) {
      if(err) return console.error(err);
      console.log('docs', docs);
      res.json(docs);
    });
  });

  // update by id
  app.put('/messages_data/:id', function(req, res) {
    Message.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/messages_data/:id', function(req, res) {
    Message.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
