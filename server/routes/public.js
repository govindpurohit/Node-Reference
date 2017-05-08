'use strict';
const express = require('express');
const validator = require('validator');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

const router = express.Router();
const User = require('../middlewares/users');
const config = require('../config/config'); // get our config file

router.post('/signup', (req,res) => {
    if(req.body.firstName == undefined || validator.isEmpty(req.body.firstName)){
      res.send({"success":false,"message":"Please provide Firstname."});
    }
    else if(!validator.isAlpha(req.body.firstName)){
      res.send({"success":false,"message":"Firstname must contain only chars."})
    }
    else if(!validator.isLength(req.body.firstName,{min:2,max:15})){
      res.send({"success":false,"message":"Firstname must be 2 to 15 chars long."});
    }
    else if(req.body.lastName == undefined || validator.isEmpty(req.body.lastName)){
      res.send({"success":false,"message":"Please provide Lastname."});
    }
    else if(!validator.isLength(req.body.lastName,{min:2,max:15})){
      res.send({"success":false,"message":"lastname must be 2 to 15 chars long."});
    }
    else if(req.body.email == undefined || !validator.isEmail(req.body.email)){
      res.send({"success":false,"message":"Please provide valid email."});
    }
    else if(req.body.password == undefined || validator.isEmpty(req.body.password)){
      res.send({"success":false,"message":"Please provide password."});
    }
    else{
        User.getUserByEmail(req.body.email).then((data) =>{
          if(data){
            res.send({"success":false,"message":"User already exist."})
          }
          else{
              User.saveUser(req.body).then((data) => {
                res.send({"success":true,"message":"Successfully Registered."});
              },(error) => {
                res.status(206).send({"success":false,"message":"Please Register again.","error":error});
              });
          }
        },(err) => {
          res.send({"success":false,"error":err,"message":"Please Register again."});
        })
        
    }
});

router.post('/signin',(req,res) => {

  if(req.body.email == undefined || !validator.isEmail(req.body.email)){
      res.send({"success":false,"message":"Please provide valid emailId."});
  }
  else if(req.body.password == undefined || validator.isEmpty(req.body.password)){
      res.send({"success":false,"message":"Please provide password."});
  }
  else{
        // find the user
  User.getUserByEmail(req.body.email).then(function(user){
    if(!user){
      res.json({ success: false, message: 'EmailId or Password may be wrong.' });
    }
    else if (user) {
      // check if password matches
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (err) { return  res.status(500).send(err); }
        if(!isMatch){return res.json({ success: false, message: 'EmailId or Password may be Wrong.' });}
         // if user is found and password is right
         var claims = { sub: user._id,
                        permissions: 'identify'
                      }
        // create a token
        var token = jwt.sign(claims,config.secret, {
          expiresIn: "24h", // expires in 24 hours
          algorithm: "HS512"
        });

        // return the information including token as JSON
        res.json({
          user:{"firstName":user.firstName,"lastName":user.lastName,"email":user.email},
          success: true,
          message: 'Enjoy SignIn!',
          secret_token: token
        });
      });  
    }
  },function(err){
    res.status(500).send(err)
  })
  }
})



module.exports = router;
