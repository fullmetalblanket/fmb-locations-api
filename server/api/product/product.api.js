var Product = require('./product.model');
var PaymentType = require('../payment-type/payment-type.model');
var ProductClass = require('../product-class/product-class.model');
var ProductGrowMethod = require('../product-grow-method/product-grow-method.model');
var ProductType = require('../product-type/product-type.model');
var CertificationType = require('../certification-type/certification-type.model');
var ConcentrateType = require('../concentrate-type/concentrate-type.model');
var CultivationEnvironment = require('../cultivation-environment/cultivation-environment.model');
var ExtractionMethod = require('../extraction-method/extraction-method.model');
var TestType = require('../test-type/test-type.model');
var User = require('../user/user.model');
var UserType = require('../user-type/user-type.model');
var authCheck = require('../../config/config').authCheck;

var populateOptions = [
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
    path: 'certification_type',
    model: 'CertificationType'
  },
  {
    path: 'cultivation_environment',
    model: 'CultivationEnvironment'
  },
  {
    path: 'concentrate_type',
    model: 'ConcentrateType'
  },
  {
    path: 'extraction_method',
    model: 'ExtractionMethod'
  },
  {
    path: 'unit_size',
    model: 'ProductUnit'
  },
  {
    path: 'payment_types',
    model: 'PaymentType'
  }
];

var populateSampleOptions = [
  {
    path: 'product_class',
    model: 'ProductClass'
  },
  {
    path: 'product_type',
    model: 'ProductType'
  },
  {
    path: 'lab.location',
    model: 'User'
  },
  {
    path: 'lab.tests.type',
    model: 'TestType'
  },
  {
    path: 'tracking.user',
    model: 'User'
  },
  {
    path: 'tracking.secondary',
    model: 'User'
  }
];

module.exports = function(app) {

  // APIs

  // select all
  app.get('/products_data', function(req, res) {
    Product.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });

  // select all populated
  app.get('/products_data_populated', function(req, res) {
    Product.find({}, function(err, docs) {
      if(err) return console.error(err);
      Product.populate(docs, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    });
  });


  // get single product populated
  app.get('/product_data_populated/:id', function(req, res) {
    Product.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      Product.populate(obj, populateOptions, function (err, doc) {
        if(err) { return handleError(res, err); }
        res.status(200).json(doc);
      });
    })
  });


  // select by user id
  app.get('/products_data/:id', function(req, res) {
    console.log('\ntryna get products by user id', req.params.id);
    Product.find({'tracking.user': req.params.id}, function(err, docs) {
      if(err) return console.error(err);
      res.status(200).json(docs);
    })
  });


  // select by user id populated
  app.get('/products_data_populated/:id', function(req, res) {
    console.log('\ntryna get products by user id', req.params.id);
    Product.find({'tracking.user': req.params.id}, function(err, objs) {
      if(err) return console.error(err);
      Product.populate(objs, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })
  });




  // select samples by user id populated - all labs
  app.get('/samples_data/:id', function(req, res) {
    console.log('\ntryna get samples by user id', req.params.id);
    Product.find({'tracking.user': req.params.id}, function(err, objs) {
      if(err) return console.error(err);
      Product.populate(objs, populateSampleOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })
  });

  // get all samples by lab id
  app.get('/samples_data_lab/:labId', function(req, res) {
    Product.find({'lab.location': req.params.labId}, function(err, docs) {
      if(err) return console.error(err);
      Product.populate(docs, populateSampleOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    });
  });

  // select samples by user id populated for specific lab use
  app.get('/samples_data_client_lab/:clientId/:labId', function(req, res) {
    console.log('\ntryna get samples by clientId', req.params.clientId);
    console.log('tryna get samples for labId', req.params.labId);
    Product.find({'tracking.user': req.params.clientId, 'lab.location': req.params.labId}, function(err, objs) {
      if(err) return console.error(err);
      Product.populate(objs, populateSampleOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        console.log('docs', docs.length);
        res.status(200).json(docs);
      });
    })
  });


  // by user type => role.name
  // select all by metadata.user_type populated
  app.get('/products_data_by_user_type_populated/:type', function(req, res) {
    console.log('\ntryna get products by metadata.user_type', req.params.type);
    Product.find({'metadata.user_type': req.params.type}, function(err, obj) {
      if(err) return console.error(err);
      Product.populate(obj, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })
  });

  // products populated by user and active status
  app.get('/user_products_data_populated_by_active_status/:id/:status', function(req, res) {
    console.log('\n--> tryna get products by user id', req.params.id);
    console.log('and active status', req.params.status);
    // const status = req.params.status==='true' ? {$exists: true, $ne: null} : {$exists: false};
    const status = req.params.status==='true' ? true : {$in: [null, false]};
    Product.find({'tracking.user': req.params.id, active: status}, function(err, obj) {
      if(err) return console.error(err);
      Product.populate(obj, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        console.log('Returning ' + docs.length + ' products');
        res.status(200).json(docs);
      });
    });
    // Product.find({'tracking.user': req.params.id, active: req.params.status}, function(err, obj) {
    //   if(err) return console.error(err);
    //   Product.populate(obj, populateOptions, function (err, docs) {
    //     if(err) { return handleError(res, err); }
    //     console.log('Returning ' + docs.length + ' products');
    //     res.status(200).json(docs);
    //   });
    // })
  });


  // select all by metadata.user_type populated restricted to
  // supplied params
  app.get('/products_data_by_user_type_special/:type/:restrictions', function(req, res) {
    console.log('\ntryna get products by metadata.user_type special type', req.params.type);
    console.log('tryna get products by metadata.user_type special restrictions', req.params.restrictions);
    var obj = {
      'metadata.user_type': req.params.type
    };

    if (req.params.restrictions !== 'false') {
      var restrictions = req.params.restrictions && req.params.restrictions.split(',');
      for (var r = 0; r < restrictions.length; r++) {
        console.log('restrictions[r]', restrictions[r]);
        var thisRestriction = restrictions[r];
        if (thisRestriction === 'active') {
          obj.active = true;
        } else {
          obj[restrictions[r]] = {$exists: true, $ne: null};
        }
      }

      // if (req.params.restrictions.indexOf('licensed') > -1) {
      //   obj['metadata.licensed'] = {$exists: true};
      // }

      // if not showing licensed only, show unlicensed only
      if (req.params.restrictions.indexOf('licensed') === -1) {
        // obj['metadata.licensed'] = [ {$exists: false}, {$exists: true, $in: ""} ];
        obj['metadata.licensed'] = {$in: [null, false]};
      }

    }
    console.log('\nspecial obj', obj);

    Product.find(obj, function(err, objs) {
      if(err) return console.error(err);
      console.log('\nspecial objs.length', objs.length);
      Product.populate(objs, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })

  });




  // select all by metadata.user_type populated restricted to
  // is active and has lab data
  app.get('/products_data_by_user_type_restricted/:type', function(req, res) {
    console.log('\ntryna get products by metadata.user_type restricted to active and has lab results', req.params.type);
    Product.find({'metadata.user_type': req.params.type, active: true, 'lab.data': { $exists: true, $ne: null }}, function(err, obj) {
      if(err) return console.error(err);
      Product.populate(obj, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })
  });


  // select all by metadata.user_type populated restricted to is active
  app.get('/products_data_by_user_type_active/:type', function(req, res) {
    console.log('\ntryna get products by metadata.user_type restricted to is active', req.params.type);
    Product.find({'metadata.user_type': req.params.type, active: true}, function(err, obj) {
      if(err) return console.error(err);
      Product.populate(obj, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })
  });

  // select all by metadata.user_type populated restricted to has lab data
  app.get('/products_data_by_user_type_with_lab_data/:type', function(req, res) {
    console.log('\ntryna get products by metadata.user_type restricted to has lab results', req.params.type);
    Product.find({'metadata.user_type': req.params.type, 'lab.data': { $exists: true, $ne: null }}, function(err, obj) {
      if(err) return console.error(err);
      Product.populate(obj, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })
  });


  // count all
  app.get('/products_data/count', function(req, res) {
    Product.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // count user products
  app.get('/products_data/count/:id', function(req, res) {
    Product.count({'tracking.user': req.params.id}, function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/products_data', function(req, res) {
    console.log('\nProduct api: create product', req.body);
    var obj = new Product(req.body);
    obj.save(function(err, product) {
      if(err) return console.error(err);
      console.log('\nproduct.api: product created', product);
      res.status(200).json(product);
    });
  });

  // find by id
  app.get('/products_data/:id', function(req, res) {
    Product.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/products_data/:id', function(req, res) {
    Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    })
  });

  // update by id and return populated product
  app.put('/edit_products_data_populated/:id', function(req, res) {
    Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, product) {
      if(err) { return handleError(res, err); }
      Product.populate(product, populateOptions, function (err, populatedProduct) {
        if(err) { return handleError(res, err); }
        res.status(200).json(populatedProduct);
      });
    })
  });

  // add new and return populated product
  app.post('/add_products_data_populated', function(req, res) {
    var obj = new Product(req.body);
    obj.save(function(err, product) {
      if(err) return console.error(err);
      Product.populate(product, populateOptions, function (err, populatedProduct) {
        console.log('\npopulatedProduct?', populatedProduct);
        if(err) {
          console.log('\nerror',err);
          return handleError(res, err);
        }
        res.status(200).json(populatedProduct);
      });
    });
  });

  // delete by id
  app.delete('/products_data/:id', function(req, res) {
    Product.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

  // decrement units_available
  app.put('/product_decrement/:id/:amount', function(req, res) {
    Product.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      obj.units_available = parseInt(obj.units_available, 10) - parseInt(req.params.amount, 10);
      obj.save(function (err) {
        if (err) {
          console.error('NOPE!!! err', err);
          res.sendStatus(404);
        }
        res.sendStatus(200);
      })
    })

  });

  // decrement units_available
  app.put('/product_increment/:id/:amount', function(req, res) {
    Product.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      obj.units_available = parseInt(obj.units_available, 10) + parseInt(req.params.amount, 10);
      obj.save(function (err) {
        if (err) {
          console.error('NOPE!!! err', err);
          res.sendStatus(404);
        }
        res.sendStatus(200);
      })
    })

  });

  // find by id
  app.get('/product_payment_types/:id', function(req, res) {
    Product.findOne({_id: req.params.id}, {payment_types: 1}, function(err, obj) {
      if(err) return console.error(err);
      // populate them
      Product.populate(obj,   {
        path: 'payment_types',
        model: 'PaymentType'
      }, function (err, populatedObjects) {
        if(err) { return handleError(res, err); }
        res.status(200).json(populatedObjects);
      });
    })
  });


  // update product lab data by product id
  app.put('/update_lab_data/:id', function(req, res) {
    Product.findById(req.params.id, function(error, product) {

      // if you want to overwrite
      // product.lab = req.body.lab;

      // if you want to merge
      Object.assign(product.lab, req.body.lab);
      Object.assign(product.lab.data, req.body.lab.data);

      product.save(function(err, obj) {
        if(err) return console.error(err);
        Product.populate(obj, populateOptions, function (err, popObj) {
          if(err) { return handleError(res, err); }
          res.status(200).json(popObj);
        });
      });
    });

  });

  // delete product lab data by product id
  app.put('/delete_lab_data/:id', function(req, res) {
    Product.findOneAndUpdate(
      { _id: req.params.id},
      { $unset : { lab : 1} },
      {new: true},
      function(err, obj) {
        if(err) return console.error(err);
        Product.populate(obj, populateOptions, function (err, popObj) {
          if(err) { return handleError(res, err); }
          res.status(200).json(popObj);
        });
      }
    );
  });


  // update product metadata by id
  app.put('/update_metadata/:id', function(req, res) {
    Product.findById(req.params.id, function(error, product) {
      // if you want to overwrite
      // product.lab = req.body.lab;

      // if you want to merge
      Object.assign(product.metadata, req.body.metadata);

      product.save(function(err, obj) {
        if(err) return console.error(err);
        Product.populate(obj, populateOptions, function (err, popObj) {
          if(err) { return handleError(res, err); }
          res.status(200).json(popObj);
        });
      });
    });

  });

};
