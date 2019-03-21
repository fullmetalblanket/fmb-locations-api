var City = require('./city.model');

module.exports = function(app) {

  // select all
  app.get('/cities', function(req, res) {
    City.find({}, function(err, docs) {
      if(err) {
        return console.error(err);
      }
      res.json(docs);
    });
  });

  // count all
  app.get('/cities/count', function(req, res) {
    City.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/cities', function(req, res) {
    var obj = new City(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/cities/:id', function(req, res) {
    City.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/cities/:id', function(req, res) {
    City.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/cities/:id', function(req, res) {
    City.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

  // find cities by state
  app.get('/state/:idx/cities', function(req, res) {
    console.log('req.params.idx',req.params.idx)
    console.log('typeof req.params.idx',typeof req.params.idx)
    City.find({state_id: req.params.idx}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });

  app.get('/seed_cities', function(req, res) {
    console.log('seeding cities')
    const citiesData = require('../../../assets/json/cities.json');
    const cities = citiesData.cities
    for (city of cities) {
      const newCity = new City(city)
      newCity.save()
    }
    res.send('Cities seeded');
  });

};
