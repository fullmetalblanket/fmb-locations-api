var ProductType = require('./product-type.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/product_types', function(req, res) {
    // console.log('\nProduct Types api: Tryna get product-listing types');
    ProductType.find({}, function(err, docs) {
      if(err) {
        // console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/product_types/count', function(req, res) {
    ProductType.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/product_types', function(req, res) {
    console.log('ProductType api: create');
    var obj = new ProductType(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/product_types/:id', function(req, res) {
    ProductType.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/product_types/:id', function(req, res) {
    ProductType.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/product_types/:id', function(req, res) {
    ProductType.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
