var CertificationType = require('./certification-type.model');

module.exports = function(app) {

  // APIs

  // select all
  app.get('/certification_types', function(req, res) {
    console.log('\nCertificationType api: Tryna get certification_types');
    CertificationType.find({}, function(err, docs) {
      if(err) {
        console.log('but I failed', err);
        return console.error(err);
      }
      // console.log('and I got something', docs);
      res.json(docs);
    });
  });

  // count all
  app.get('/certification_types/count', function(req, res) {
    CertificationType.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/certification_types', function(req, res) {
    console.log('CertificationType api: create');
    var obj = new CertificationType(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/certification_types/:id', function(req, res) {
    CertificationType.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/certification_types/:id', function(req, res) {
    CertificationType.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/certification_types/:id', function(req, res) {
    CertificationType.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
