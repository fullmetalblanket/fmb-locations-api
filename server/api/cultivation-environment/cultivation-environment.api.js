var CultivationEnvironment = require('./cultivation-environment.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/cultivation_environments', function(req, res) {
    // console.log('\nProduct Units api: Tryna get product-listing units');
    CultivationEnvironment.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/cultivation_environments/count', function(req, res) {
    CultivationEnvironment.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/cultivation_environments', function(req, res) {
    console.log('CultivationEnvironment api: create');
    var obj = new CultivationEnvironment(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/cultivation_environments/:id', function(req, res) {
    CultivationEnvironment.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/cultivation_environments/:id', function(req, res) {
    CultivationEnvironment.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/cultivation_environments/:id', function(req, res) {
    CultivationEnvironment.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
