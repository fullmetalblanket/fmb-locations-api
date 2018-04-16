var PaymentType = require('./payment-type.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/payment_types', function(req, res) {
    // console.log('\nPayment Types api: Tryna get product-listing types');
    PaymentType.find({}, function(err, docs) {
      if(err) {
        // console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/payment_types/count', function(req, res) {
    PaymentType.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/payment_types', function(req, res) {
    console.log('PaymentType api: create');
    var obj = new PaymentType(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/payment_types/:id', function(req, res) {
    PaymentType.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/payment_types/:id', function(req, res) {
    PaymentType.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/payment_types/:id', function(req, res) {
    PaymentType.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

};
