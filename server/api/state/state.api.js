var State = require('./state.model');

module.exports = function(app) {

  // select all
  app.get('/states', function(req, res) {
    State.find({}, function(err, docs) {
      if(err) {
        return console.error(err);
      }
      res.json(docs);
    });
  });

  // count all
  app.get('/states/count', function(req, res) {
    State.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/states', function(req, res) {
    var obj = new State(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/states/:id', function(req, res) {
    State.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/states/:id', function(req, res) {
    State.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/states/:id', function(req, res) {
    State.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

  // find by country
  app.get('/states/:idx', function(req, res) {
    State.find({country_id: req.params.idx}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    })
  });

  app.get('/seed_states', function(req, res) {
    console.log('seeding states')
    const statesData = require('../../../assets/json/states.json');
    const states = statesData.states
    for (state of states) {
      const newState = new State(state)
      newState.save()
    }
    res.send('States seeded');
  });

};
