var ConcentrateType = require('./concentrate-type.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/concentrate_types', function(req, res) {
    // console.log('\nProduct Units api: Tryna get product-listing units');
    ConcentrateType.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/concentrate_types/count', function(req, res) {
    ConcentrateType.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/concentrate_types', function(req, res) {
    console.log('ConcentrateType api: create');
    var obj = new ConcentrateType(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/concentrate_types/:id', function(req, res) {
    ConcentrateType.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/concentrate_types/:id', function(req, res) {
    ConcentrateType.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/concentrate_types/:id', function(req, res) {
    ConcentrateType.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
