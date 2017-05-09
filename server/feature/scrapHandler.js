var schedule = require('node-schedule');

const USER = require('../middlewares/users');
var scrapper = require('./newsScrapper');
const EXP = require('../middlewares/expression');

var j = schedule.scheduleJob('*/10 * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});

exports.liveNews = function(){
  let allUsers = getAllUser();
  if(allUsers != null){
    get
  }
}

function getAllUser(){
  let users;
  USER.getAllUsers().then((data) => {
    users = (data && data.length > 0) ? data : null;
  },
  (err) => {
    console.log("Error:"+err);
  });
  return users;
}