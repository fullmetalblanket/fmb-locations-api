var ExtractionMethod = require('./extraction-method.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/extraction_methods', function(req, res) {
    // console.log('\nProduct Units api: Tryna get product-listing units');
    ExtractionMethod.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/extraction_methods/count', function(req, res) {
    ExtractionMethod.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/extraction_methods', function(req, res) {
    console.log('ExtractionMethod api: create');
    var obj = new ExtractionMethod(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/extraction_methods/:id', function(req, res) {
    ExtractionMethod.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/extraction_methods/:id', function(req, res) {
    ExtractionMethod.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/extraction_methods/:id', function(req, res) {
    ExtractionMethod.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
