var User = require('./user.model');
// var UserType = require('../user-type/user-type.model');
// var http = require('http');
// var request = require('request');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var utils = require('../../config/utils');
// var UserType = require('../user-type/user-type.model');

var populateOptions = [
  {
    path: 'role',
    model: 'UserType'
  }
];

function userRequestOptions(id, params, body) {
  var options = {
    url: userApi + id,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  };
  if (body) {
    options.body = body;
    options.json = true;
  }
  return options;
}


module.exports = function(app) {

  // APIs

  // select all
  app.get('/users_data', function(req, res) {
    User.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });

  app.get('/users_data_populated', function(req, res) {
    User.find({}, function(err, docs) {
      if(err) return console.error(err);
      User.populate(docs, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    });
  });

  // count all
  app.get('/users_data/count', function(req, res) {
    User.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  // signUp / create
  app.post('/user_signup', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) return console.error('login error', err);
      if (user) {
        return res.status(403).json({
          message: 'User already exists'
        });
      }
      var obj = new User(req.body);
      console.log('User api: user a', obj);
      // encrypt password
      obj.password = bcrypt.hashSync(obj.password, 10);
      // set activation token
      obj.save(function(err, newUser) {
        if(err) return console.error(err);
        res.status(200).json(newUser);
      });
    })
  });

  // login by email
  app.post('/user_login', function(req, res) {
    console.log('user_login req.body.email', req.body.email);
    console.log('user_login req.body.password', req.body.password);
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) {
        console.error('login err',err);
        return console.error('login error', err);
      }
      if (!user) {
        console.error('login no user found');
        return res.status(200).json({
          error: 'User not found'
        });
      }
      // check password
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        console.error('login or password incorrect');
        return res.status(200).json({
          error: 'Password is incorrect'
        });
      }

      // console.log('user_login user',user)

      User.populate(user, populateOptions, function (err, user) {
        if(err) { return handleError(res, err); }

        // console.log('user_login populated user',user)
        // create token
        const role = user.role.name;
        const { sessionExpiresIn } = config;
        const expiresIn = role === 'admin' || role === 'laboratory' ? sessionExpiresIn.admin : sessionExpiresIn.user;
        // const expiresIn = new Date(expires * 1000).toISOString().substr(11, 8);
        // console.log('user_login: expires', expires);
        console.log('user_login expiresIn', expiresIn);

        // generate a token
        const token = jwt.sign({user: user}, config.tokenSecret, { expiresIn });

        // user.token = token
        // user.save()
        // user.token = ""

        // create a cookie to send
        res.cookie('evercase_token', token, {
          secure: false,
          httpOnly: false,
          maxAge: expiresIn
        })

        console.log('user_login sending res.status(200)');

        // res.status(200).json(user);
        res.status(200).json({ user, token });
        // res.send({ user, token });
      });
    })
  });

    // // login by email 2
    // app.post('/user_login_2', function(req, res) {
    //   console.log('user_login req.body.email', req.body.email);
    //   User.findOne({email: req.body.email}, function(err, user) {
    //     if (err) {
    //       console.error('login err',err);
    //       return console.error('login error', err);
    //     }
    //     if (!user) {
    //       console.error('login no user found');
    //       return res.status(200).json({
    //         error: 'User not found'
    //       });
    //     }
    //     // check password
    //     if (!bcrypt.compareSync(req.body.password, user.password)) {
    //       console.error('login or password incorrect');
    //       return res.status(200).json({
    //         error: 'Password is incorrect'
    //       });
    //     }
    //     // create token
    //     const role = user.role.name;
    //     const { sessionExpiresIn } = config
    //     const expiresIn = role === 'admin' || role === 'laboratory' ? sessionExpiresIn.admin : sessionExpiresIn.user;
    //     var token = jwt.sign({user: user}, config.tokenSecret, {
    //       expiresIn: sessionExpiresIn
    //     });

    //     User.populate(user, populateOptions, function (err, user) {
    //       if(err) { return handleError(res, err); }
    //       res.status(200).json({
    //         message: 'Successfully logged in',
    //         token: token,
    //         user: user,
    //         userId: user._id
    //       });
    //     });
    //   })
    // });

  // find by id
  app.get('/users_data/:id', function(req, res) {
    var userID = req.params.id;
    if (userID._id) {
      userID = userID._id
    }
    User.findOne({_id: userID}, function(err, obj) {
      if(err) return console.error(err);
      User.populate(obj, populateOptions, function (err, doc) {
        if(err) { return handleError(res, err); }
        res.status(200).json(doc);
      });
    })
  });

  // find user by id populated
  app.get('/user_data_populated/:id', function(req, res) {
    console.log('user_data_populated id');
    User.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      User.populate(obj, populateOptions, function (err, docs) {
        if(err) { return handleError(res, err); }
        res.status(200).json(docs);
      });
    })
  });

  // update by id
  app.put('/user_data/:id', function(req, res) {
    console.log('\nuser_data', req.body);
    User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, obj) {
      if(err) return console.error(err);
      console.log('\nobj', obj);
      User.populate(obj, populateOptions, function (err, doc) {
        if(err) { return handleError(res, err); }
        res.status(200).json(doc);
      });
    })
  });

  // delete by id
  app.delete('/user_data/:id', function(req, res) {
    User.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

  // generate and store reset password token
  app.put('/set_reset_password_token/:email', function(req, res) {
    // generate the token
    var token = utils.randomString(64);
    var update = {
      reset_password_token: token,
      reset_password_token_expires: Date.now() + 3600000 //1hr
    };
    console.log('set_reset_password_token req.params',req.params)
    User.findOneAndUpdate({email: req.params.email}, update, {new: true}, function(err, obj) {
      if(err) return console.error(err);
      console.log('obj', obj);
      res.status(200).json(obj);
    });

  });

  // get users by role
  app.get('/users_data_by_role/:role', function(req, res) {
    User.find({role: req.params.role}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // find by email
  app.get('/users_data_by_email/:email', function(req, res) {
    User.findOne({email: req.params.email}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // find by partial email
  app.get('/users_data_by_partial_email/:email', function(req, res) {
    User.find({email: { $regex: req.params.email } }, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // query for user
  app.get('/query_for_user/:query', function(req, res) {
    var queryRegex = new RegExp(req.params.query.toLowerCase(), "i");
    var searchQuery = {$or: [{email: { $regex: req.params.query, $options: 'i' }}, {'business.business_name': { $regex: req.params.query, $options: 'i' }}]}
    // User.createIndex({$or:[{email:'text'}, {'business.business_name':'text'}]})
    // User.index({email:'text'})
    // User.createIndex({email: 1, 'business.business_name': 1}, {unique: true});
    // var textQuery = {
    //   $text: {
    //     $search: req.params.query,
    //     $caseSensitive: false,
    //   }
    // }
    User.find(searchQuery, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // find by license
  app.get('/users_data_by_license/:license', function(req, res) {
    User.findOne({'credentials.license': req.params.license}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  // reset password
  app.put('/reset_password', function(req, res) {
    var update = {
      password: bcrypt.hashSync(req.body.password, 10),
      reset_password_token: '',
      reset_password_token_expires: null
    };
    console.log('reset password req.body',req.body);
    console.log('reset password update',update);
    User.findOneAndUpdate({email: req.body.email}, update, {new: true}, function(err, obj) {
      if(err) return console.error(err);
      console.log('obj', obj);
      res.status(200).json(obj);
    });
  });

  // add new address
  app.put('/add_address/:user/:address', function(req, res) {
    console.log('user api: add_address', req.params);
    User.findById(req.params.user, function (err, user) {
      user.addresses.push(req.body);
      user.save(function(err, obj) {
        if(err) return console.error(err);
        res.status(200).json(obj);
      });
    })
  });

  // update address by address id
  app.put('/update_address/:address', function(req, res) {
    var updateObj = {};
    var updateKeys = Object.keys(req.body);
    for(var key = 0; key < updateKeys.length; key++) {
      var thisKey = updateKeys[key];
      updateObj['addresses.$.'+thisKey] = req.body[thisKey];
    }
    User.findOneAndUpdate(
      {'addresses._id': req.params.address},
      {'$set': updateObj},
      {new: true},
      function(err, obj) {
        if(err) return console.error(err);
        console.log('UPDATE USER ADDRESS: updated obj', obj);
        res.status(200).json(obj);
      }
    )
  });

  app.put('/remove_address/:user/:address', function(req, res) {
    console.log('user api: remove_address params', req.params);
    User.update(
      { '_id': req.params.user },
      { '$pull': { 'addresses': { '_id': req.params.address } } },
      function(err, numAffected) {
        if(err){
          console.log(err);
        } else {
          res.status(200).send();
        }
      }
    );
  });

  app.put('/set_default_address/:user/:address', function(req, res) {
    User.findById(req.params.user, function (err, user) {
      if (user.addresses && user.addresses.length) {
        user.addresses.forEach(function(address) {
          address.default = address._id.toString()===req.params.address;
        });
        user.save(function(err, obj) {
          if(err) return console.error(err);
          res.status(200).json(obj);
        });
      } else {
        res.status(200)
      }
    })
  });



  // user settings

  // products

  // save user preferences and settings
  app.put('/save_settings/:id/:setting/:update', function(req, res) {
    console.log('\nupdate settings product filters: setting ', req.params.setting);
    console.log('update settings product filters: update', req.params.update);
    var setting = req.params.setting;
    var updateObj = {};
    // TODO: what does update=false do?
    // I think it's just used to set the setting to an empty string -> YES
    updateObj[setting] = req.params.update == 'false' ? '' : req.params.update;
    User.findOneAndUpdate({_id: req.params.id}, updateObj, {new: true}, function(err, obj) {
      if(err) return console.error(err);
      // console.log('\nupdated user', obj);
      User.populate(obj, populateOptions, function (err, doc) {
        if(err) { return handleError(res, err); }
        res.status(200).json(doc);
      });
    })
  });



  // sales

  // credit sales user
  app.put('/credit_sales_user/:salesUser/:newUser', function(req, res) {
    User.findOneAndUpdate(
      {_id: req.params.salesUser},
      {'$push': {"sales.sign_ups": req.params.newUser}},
      {new: true},
      function(err, obj) {
        if(err) return console.error(err);
        res.status(200).json(obj);
      }
    )
  });

};
