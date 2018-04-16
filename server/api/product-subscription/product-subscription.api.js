var ProductSubscription = require('./product-subscription.model');
var Product = require('../product/product.model');
var ProductUnit = require('../product-unit/product-unit.model');
var ProductClass = require('../product-class/product-class.model');

const populateOptions = [
  {
    path: 'product_class',
    model: 'ProductClass'
  },
  {
    path: 'product_grow_method',
    model: 'ProductGrowMethod'
  },
  {
    path: 'product_type',
    model: 'ProductType'
  },
  {
    path: 'unit_size',
    model: 'ProductUnit'
  }
];

module.exports = function(app) {

  // APIs

  // select all
  app.get('/product_subscriptions', function(req, res) {
    console.log('\nProduct Types api: Tryna get product-subscriptions');
    ProductSubscription.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/product_subscriptions/count', function(req, res) {
    ProductSubscription.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/product_subscriptions', function(req, res) {
    console.log('ProductSubscription api: create');
    var obj = new ProductSubscription(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by subscription id
  app.get('/product_subscriptions/:id', function(req, res) {
    ProductSubscription.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });


  // find all product subscriptions by user id, populating product
  app.get('/product_subscriptions_by_user/:id', function(req, res) {
    // console.log('\nproduct_subscription_by_user: req.params', req.params);
    // ProductSubscription.find({user: req.params.id}, function(err, docs) {
    //   if(err) return console.error(err);
    //   res.json(docs);
    // })



    // need to populate product unit_size

    // Product.findOne({_id: req.params.id}, function(err, obj) {
    //   if(err) return console.error(err);
    //   Product.populate(obj, populateOptions, function (err, doc) {
    //     if(err) { return handleError(res, err); }
    //     res.status(200).json(doc);
    //   });
    // })



    ProductSubscription
      .find({user: req.params.id})
      .populate({
        path: 'product',
        model: 'Product',
        populate: populateOptions
      })
      .exec(function(err, docs) {
        if(err) return console.error(err);
        res.json(docs);
    });
  });

  // // find all by user id, populating product_subscription or message
  // app.get('/notifications_data_by_user/:userID', function(req, res) {
  //   console.log('\nnotifications_data_by_user: req.params', req.params);
  //
  //   Notification
  //     .find({user: req.params.userID})
  //     .populate({
  //       path: 'product_subscription',
  //       model: 'ProductSubscription',
  //       populate: {
  //         path:  'product',
  //         model: 'Product'
  //       }
  //     })
  //     .exec(function(err, docs){
  //       if (err) return handleError(err);
  //       res.json(docs);
  //     });
  //
  // });


  // find single subscription by user id and product id
  app.get('/product_subscription_by_user/:userID/:productID', function(req, res) {
    // console.log('\nproduct_subscription_by_user: req.params', req.params);
    ProductSubscription.findOne({user: req.params.userID, product: req.params.productID}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // find single subscription by user id and product id where message equals null doesn't exist, should only be one
  app.get('/product_subscription_by_user_outstanding/:userID/:productID', function(req, res) {
    console.log('\nproduct_subscription_by_user: where message doesn\'t exist req.params', req.params);
    ProductSubscription.findOne({ user: req.params.userID, product: req.params.productID, message: {$exists: false} }, function(err, docs) {
      if(err) return console.error(err);
      console.log('docs', docs);
      res.json(docs);
    });
  });

  // update by id
  // from productSubscriptionService: editProductSubscription(productSubscription)
  app.put('/product_subscriptions/:id', function(req, res) {
    ProductSubscription.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/product_subscriptions/:id', function(req, res) {
    ProductSubscription.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
