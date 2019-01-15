var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config/config'); // get our config file

function verifyToken(req, res, next) {
  // console.log('verifyToken req.headers',req.headers)
  // check header or url parameters or post parameters for token
  // The client should be sending the token in the Authorization header, using the Bearer scheme, as 'X-' headers have been deprecated since 2012:
  var authToken = req.headers.authorization;
  var token = authToken && authToken.replace('Bearer ', '');
  // console.log('verifyToken token',token)
  if (!token) {
    console.log('verifyToken no token');
    return res.status(403).send({ auth: false, message: 'No token provided.' }).end();
    // res.status(403).send({ auth: false, message: 'No token provided.' }).end();
    next();
  }

  // verifies secret and checks exp
  jwt.verify(token, config.tokenSecret, function(err, decoded) {    
    console.log('verifyToken complete');  
    if (err) {
      console.log('verifyToken err',err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }).end(); 
      // res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); 
    }   

    console.log('verifyToken decoded',decoded)
    console.log('verifyToken decoded.id',decoded.id)
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;

    console.log('\n+ + + + + User Authorized + + + + +\n');
    next();
  });

  // next();

}

module.exports = verifyToken;