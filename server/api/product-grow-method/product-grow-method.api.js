var ProductGrowMethod = require('./product-grow-method.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/product_grow_methods', function(req, res) {
    // console.log('\nProduct Grow Methods api: Tryna get product-listing grow methods');
    ProductGrowMethod.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/product_grow_methods/count', function(req, res) {
    ProductGrowMethod.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/product_grow_methods', function(req, res) {
    console.log('ProductGrowMethod api: create');
    var obj = new ProductGrowMethod(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/product_grow_methods/:id', function(req, res) {
    ProductGrowMethod.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/product_grow_methods/:id', function(req, res) {
    ProductGrowMethod.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/product_grow_methods/:id', function(req, res) {
    ProductGrowMethod.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
