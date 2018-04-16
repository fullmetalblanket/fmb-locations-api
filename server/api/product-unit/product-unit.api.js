var ProductUnit = require('./product-unit.model');
var authCheck = require('../../config/config').authCheck;

module.exports = function(app) {

  // APIs

  // select all
  app.get('/product_units', function(req, res) {
    // console.log('\nProduct Units api: Tryna get product-listing units');
    ProductUnit.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/product_units/count', function(req, res) {
    ProductUnit.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/product_units', function(req, res) {
    console.log('ProductUnit api: create');
    var obj = new ProductUnit(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/product_units/:id', function(req, res) {
    ProductUnit.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/product_units/:id', function(req, res) {
    ProductUnit.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/product_units/:id', function(req, res) {
    ProductUnit.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
