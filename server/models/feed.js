'use strict';

const mongoose = require('mongoose');
const User = require('./user')
const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

const feed = new Schema({ 
    name:{type:String,required:true}, 
    optionalKeywords: [String],
    requiredKeywords: [String],
    excludedKeywords: [String],
    creator: {type:Schema.Types.ObjectId,ref: User}
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Feed',feed);