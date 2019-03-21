var Country = require('./country.model');

module.exports = function(app) {

  // select all
  app.get('/countries', function(req, res) {
    Country.find({}, function(err, docs) {
      if(err) {
        return console.error(err);
      }
      res.json(docs);
    });
  });

  // count all
  app.get('/countries/count', function(req, res) {
    Country.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/countries', function(req, res) {
    var obj = new Country(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/countries/:id', function(req, res) {
    Country.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/countries/:id', function(req, res) {
    Country.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/countries/:id', function(req, res) {
    Country.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

  app.get('/seed_countries', function(req, res) {
    console.log('seeding countries')
    const countriesData = require('../../../assets/json/countries.json');
    const countries = countriesData.countries
    for (country of countries) {
      const newCountry = new Country(country)
      newCountry.save()
    }
    res.send('Countries seeded');
  });

};
