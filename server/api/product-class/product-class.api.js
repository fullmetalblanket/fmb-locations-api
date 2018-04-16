var ProductClass = require('./product-class.model');
var authCheck = require('../../config/config').authCheck;

module.exports = function(app) {

  // APIs

  // select all
  app.get('/product_classes', function(req, res) {
    // console.log('\nProduct Class api: Tryna get product-listing classes');
    ProductClass.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/product_classes/count', function(req, res) {
    ProductClass.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/product_classes', function(req, res) {
    console.log('ProductClass api: create');
    var obj = new ProductClass(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/product_classes/:id', function(req, res) {
    ProductClass.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/product_classes/:id', function(req, res) {
    ProductClass.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/product_classes/:id', function(req, res) {
    ProductClass.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
