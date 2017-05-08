'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/config');

exports.authorize = function(req,res,next){
  // check header or url parameters or post parameters for token
  let token ;// req.body.token || req.query.token || req.headers['x-access-token'];

   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    } else if (req.body && req.body.token) {
        token = req.body.token;
    } else if (req.headers && req.headers['x-access-token']){
        token = req.headers['x-access-token'];
    }
    
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token,config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'You are not authorized to do this operation.' 
    }); 
  }
}