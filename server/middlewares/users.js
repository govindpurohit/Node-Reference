'use strict'

const User = require('../models/user');
const Promise = require('bluebird');

exports.saveUser = function (user,done){
  var newUser = new User(user);
   return new Promise(function(resolve, reject){
     // save the user
    newUser.save().then(function(data){
        resolve(data)},
        function(error){
            reject(error)
    });
  });
}

exports.getAllUsers = function(){
  return new Promise(function(resolve,reject){
    User.find().then(function(data){
      resolve(data)
    },
      function(error){
        reject(error)
      });
  });
}

exports.getUserByEmail = function(email){
  return new Promise(function(resolve,reject){
    User.findOne({email:email}).then(function(data){
      resolve(data)
    },
      function(error){
        reject(error)
      });
  });
}

exports.getUserById = function(id){
  return new Promise(function(resolve,reject){
    User.findById({_id:id}).then(function(data){
      resolve(data);
    },
      function(error){
        reject(error)
      });
  });
}