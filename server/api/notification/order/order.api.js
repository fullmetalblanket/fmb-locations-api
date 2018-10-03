var Order = require('./order.model');
var Product = require('../product/product.model');
var ProductType = require('../product-type/product-type.model');
var ProductUnit = require('../product-unit/product-unit.model');
var User = require('../user/user.model');
var authCheck = require('../../config/config').authCheck;


const populateOptions = [
  {
    path: 'products.product',
    model: 'Product'
  },
  {
    path: 'products.product_class',
    model: 'ProductClass'
  },
  {
    path: 'products.product_grow_method',
    model: 'ProductGrowMethod'
  },
  {
    path: 'products.product_type',
    model: 'ProductType'
  },
  {
    path: 'products.payment.payment_type',
    model: 'PaymentType'
  },
  {
    path: 'products.payment.alternative',
    model: 'PaymentType'
  },
  {
    path: 'products.canceled.user',
    model: 'User'
  }
];

const extraPopulateOptions = [
  {
    path: 'products.seller',
    model: 'User'
  },
  {
    path: 'user',
    model: 'User'
  }
];

module.exports = function(app) {

  // APIs

  // select all
  app.get('/orders_data', function(req, res) {
    Order.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });

  // select all populated
  app.get('/orders_data_populated', function(req, res) {
    Order.find({}, function(err, docs) {
      if(err) return console.error(err);


      Order.populate(docs, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });

      // res.json(docs);
    });
  });


  // get orders by purchaser id
  app.get('/orders_data_by_user/:id', function(req, res) {
    console.log('Order api: get orders by user', req.params.id);
    Order.find({user: req.params.id}, function(err, docs) {
      if(err) return console.error(err);
      Order.populate(docs, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
      // res.json(docs);
    });
  });

  // get recent orders by purchaser id
  app.get('/recent_orders_data_by_user/:id/:limit', function(req, res) {
    console.log('Order api: get orders by user', req.params.id);
    console.log('Order api: limit', req.params.limit);
    var limit = parseInt(req.params.limit, 10);
    var q = Order.find({user: req.params.id}).sort({'date': -1}).limit(limit);
    q.exec(function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });

  // user purchase orders by delivery status
  app.get('/user_orders_data_by_delivery_status/:id/:status', function(req, res) {
    console.log('\nOrder api: get user orders by delivery status');
    console.log('id', req.params.id);
    console.log('status', typeof req.params.status);
    const action = req.params.status==='true' ? {$exists: true, $ne: null} : {$exists: false};
    console.log('action', action);
    Order.find({ user: req.params.id, delivered_date: action }, function(err, docs) {
      if(err) return console.error(err);
      console.log('docs', docs);
      res.json(docs);
    });
  });


  // get orders by seller id
  app.get('/orders_data_by_seller/:id', function(req, res) {
    console.log('\nOrder api: get orders by seller', req.params.id);
    Order.find({"products.seller": req.params.id}, function(err, docs) {
      if(err) return console.error(err);
      var opts = [
        {
          path: 'products.product',
          model: 'Product'
        }
      ];
      Order.populate(docs, populateOptions, function (err, docs) {
        if(err) return console.error(err);
        res.status(200).json(docs);
      });
      // res.json(docs);
    });
  });


  // get recent orders by seller id
  app.get('/recent_orders_data_by_seller/:id/:limit', function(req, res) {
    console.log('\nOrder api: get orders by seller', req.params.id);
    console.log('Order api: limit', req.params.limit);
    var limit = parseInt(req.params.limit, 10);
    var q = Order.find({"products.seller": req.params.id}).sort({'date': -1}).limit(limit);
    q.exec(function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });


  // count all
  app.get('/orders_data/count', function(req, res) {
    Order.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/orders_data', function(req, res) {
    console.log('Order api: post');
    var obj = new Order(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by order id
  app.get('/orders_data/:id', function(req, res) {
    console.log('\norder.api: find order', req.params.id);
    Order.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      Order.populate(obj, populateOptions, function (err, updatedObj) {
        if(err) return console.error(err);
        res.status(200).json(updatedObj);
      });
      // res.json(obj);
    })
  });

  // find by order id populated
  app.get('/orders_data_populated/:id', function(req, res) {
    Order.findOne({_id: req.params.id}, function(err, order) {
      if(err) return console.error(err);

      console.log('\norders_data_populated', order.products);

      // [..order.products].map(product-listing => {
      //
      // });

      // var opts = [
      //   {
      //     path: 'products',
      //     model: 'Product'
      //   },
      // ];
      // Order.populate(docs, opts, function (err, docs) {
      //   if(err) { return handleError(res, err); }
      //   res.status(200).json(docs);
      // });
      res.status(200).json(order);
    })
  });

  // edit order by id, update by id -> editOrder()
  app.put('/orders_data/:id', function(req, res) {
    console.log('\norders.api: order', req.params.id);
    console.log('orders.api: body', req.body);
    Order.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, order) {
      if(err) return console.error(err);
      res.status(200).json(order);
    })
  });

  // delete by id
  app.delete('/orders_data/:id', function(req, res) {
    Order.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


  // // set order product as out for delivery (delivery_status)
  // app.put('/set_order_product_delivery_status/:orderID/:productID', function(req, res) {
  //   Order.findOne({_id: req.params.orderID}, function(err, order) {
  //     if(err) return console.error(err);
  //     if(!order) {
  //       console.log('didnt find one');
  //       res.sendStatus(404);
  //     }
  //     // get the order product index
  //     const productIndex = order.products.findIndex(function(product) {
  //       return product.product.toString() === req.params.productID;
  //     });
  //     // set the delivery status
  //     order.products[productIndex].delivery_status = req.body.status;
  //     // save the order
  //     order.save(function (err) {
  //       if (err) {
  //         console.error('NOPE!!! err', err);
  //         res.sendStatus(404);
  //       }
  //       console.log('\norder.api: order saved', order);
  //       res.json(order);
  //     })
  //   })
  // });
  //
  //
  // // set order product as delivered (delivered_date)
  // app.put('/set_product_as_delivered/:orderID/:productID', function(req, res) {
  //   Order.findOne({_id: req.params.orderID}, function(err, order) {
  //     if(err) return console.error(err);
  //     if(!order) {
  //       console.log('didnt find one');
  //       res.sendStatus(404);
  //     }
  //     // get the order product index
  //     const productIndex = order.products.findIndex(function(product) {
  //       return product.product.toString() === req.params.productID;
  //     });
  //     // set the delivery date
  //     order.products[productIndex].delivered_date = new Date();
  //     // save the order
  //     order.save(function (err) {
  //       if (err) {
  //         console.error('NOPE!!! err', err);
  //         res.sendStatus(404);
  //       }
  //       console.log('\norder.api: order saved', order);
  //       res.json(order);
  //     })
  //   })
  // });


  // update order product
  app.put('/update_order_product/:orderID/:productID', function(req, res) {
    console.log('\nupdate_order_product: body', req.body);
    Order.findOne({_id: req.params.orderID}, function(err, order) {
      if(err) return console.error(err);
      if(!order) {
        console.log('didn\'t find one');
        res.sendStatus(404);
      }
      // get the order product index
      const productIndex = order.products.findIndex(function(product) {
        return product.product.toString() === req.params.productID;
      });
      // update the product
      // order.products[productIndex] = req.body;
      Object.assign(
        order.products[productIndex],
        req.body
      );
      // save the order
      order.save(function (err) {
        if (err) {
          console.error('NOPE!!! err', err);
          res.sendStatus(404);
        }
        console.log('\norder.api: order saved', order);
        // res.json(order);
        res.status(200).json(order);
      })
      // res.sendStatus(200);
    })
  });


  // set single order product payment type as accepted
  app.put('/accept_payment_type/:order/:product', function(req, res) {
    console.log('order api: accept_payment_type', req.params);

    Order.findOneAndUpdate(
      { _id: req.params.order,  "products.product" : req.params.product},
      {
        '$set': {
          'products.$.payment.accepted': true
        },
        '$unset': {
          'products.$.payment.alternative': 1
        }
      },
      {new: true},
      function(err, obj) {
        if(err) return console.error(err);
        console.log('UPDATE ORDER PAYMENT ACCEPTED: true');
        Order.populate(obj, populateOptions, function (err, updatedObj) {
          if(err) return console.error(err);
          res.status(200).json(updatedObj);
        });
      }
    );

  });


  // add alternate payment type suggestion, in effect denying buyer's original choice
  app.put('/deny_payment_type/:order/:product/:paymentType', function(req, res) {
    console.log('order api: accept_payment_type', req.params);

    Order.findOneAndUpdate(
      { _id: req.params.order,  "products.product" : req.params.product},
      {'$set': {
        'products.$.payment.alternative': req.params.paymentType,
      }},
      {new: true},
      function(err, obj) {
        if(err) return console.error(err);
        console.log('UPDATE ORDER PAYMENT DENIED: true');
        Order.populate(obj, populateOptions, function (err, updatedObj) {
          if(err) return console.error(err);
          res.status(200).json(updatedObj);
        });
      }
    );

  });


  app.put('/remove_order_product/:order/:product', function(req, res) {
    console.log('order api: remove_order_product', req.params);

    Order.findOneAndUpdate(
      { _id: req.params.order},
      {'$pull': {
        products: {
          product: req.params.product
        }
      }},
      {new: true},
      function(err, obj) {
        if(err) return console.error(err);
        console.log('UPDATE remove_order_product: true');
        Order.populate(obj, populateOptions, function (err, updatedObj) {
          if(err) return console.error(err);
          res.status(200).json(updatedObj);
        });
      }
    );

  });


  // get all populated with full info
  app.get('/orders_data_populated_full', function(req, res) {
    Order.find({}, function(err, docs) {
      if(err) return console.error(err);

      const popOpts = populateOptions.concat(extraPopulateOptions);

      // console.log('\norders_data_populated_full: popOpts', popOpts);

      Order.populate(docs, popOpts, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });

      // res.json(docs);
    });
  });


  // get all orders by date
  app.get('/orders_data_by_date/:startdate/:enddate', function(req, res) {
    console.log('Order api: get orders by startdate', req.params.startdate);
    console.log('Order api: get orders by enddate', req.params.enddate);

    var q = Order.find({date: {
      $gte: ISODate("2010-04-29T00:00:00.000Z"),
      $lt: ISODate("2010-05-01T00:00:00.000Z")
    }}).sort({'date': -1});
    q.exec(function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });


};
