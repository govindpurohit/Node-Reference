'use strict'

const Reference = require('../../models/reference');
const Promise = require('bluebird');

exports.saveReference = function (reference,done){
  var newReference = new Reference(reference);
   return new Promise(function(resolve, reject){
     // save the user
    newReference.save().then(function(data){
        resolve(data)},
        function(error){
            reject(error)
    });
  });
}
// .skip((dataLimit-1)*10).limit(10)
exports.getAllReference = function(dataLimit,id){
  return new Promise(function(resolve,reject){
    Reference.find({feedReference:id}).sort({"createdAt":-1}).then(function(data){
      // console.log("Limit:"+data.length);
      resolve(data)
    },
      function(error){
        reject(error)
      });
  });
}

exports.deleteReferenceById = function(id){
  return new Promise((resolve,reject) => {
    Reference.remove({_id:id}).then((data) =>{
      resolve(data);
    },
    (err) => {
      reject(err);
    })
  })
}

exports.deleteReferenceByFeedId = function(id){
  return new Promise((resolve,reject) => {
    Reference.remove({feedReference:id}).then((data) => {
      resolve(data);
  },
  (err) => {
    reject(err);
  })
  })
}

// exports.getAllFeeds = function(){
//   return new Promise(function(resolve,reject){
//     Feed.find().then(function(data){
//       resolve(data)
//     },
//       function(error){
//         reject(error)
//       });
//   });
// }

// exports.getUserByEmail = function(email){
//   return new Promise(function(resolve,reject){
//     User.findOne({email:email}).then(function(data){
//       resolve(data)
//     },
//       function(error){
//         reject(error)
//       });
//   });
// }

// exports.getFeedByUser = function(id){
//   return new Promise(function(resolve,reject){
//     User.find({creator:id}).then(function(data){
//       resolve(data);
//     },
//       function(error){
//         reject(error)
//       });
//   });
// }
