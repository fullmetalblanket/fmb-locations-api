var TestType = require('./test-type.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/test_types', function(req, res) {
    TestType.find({}, function(err, docs) {
      if(err) {
        // console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/test_types/count', function(req, res) {
    TestType.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/test_types', function(req, res) {
    console.log('TestType api: create');
    var obj = new TestType(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/test_types/:id', function(req, res) {
    TestType.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/test_types/:id', function(req, res) {
    TestType.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/test_types/:id', function(req, res) {
    TestType.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
