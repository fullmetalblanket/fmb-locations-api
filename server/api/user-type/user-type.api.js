var UserType = require('./user-type.model');
// var authCheck = require('../../config/config').authCheck;
var VerifyToken = require('../../auth/verify-token');

module.exports = function(app) {

  // select all
  app.get('/user_types', function(req, res, next) {
    // console.log('\nget user_types');
    // console.log('\nget user types req.headers',req.headers);
    UserType.find({}, function(err, docs) {
      if(err) {
        console.log('user_types: but I failed', err);
        return console.error(err);
      }
      res.status(200).json(docs);
    });
  });

  // count all
  app.get('/user_types/count', function(req, res) {
    UserType.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // create
  app.post('/user_types', function(req, res) {
    console.log('UserType api: create');
    var obj = new UserType(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/user_types/:id', function(req, res) {
    UserType.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // update by id
  app.put('/user_types/:id', function(req, res) {
    UserType.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  // delete by id
  app.delete('/user_types/:id', function(req, res) {
    UserType.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });


};
