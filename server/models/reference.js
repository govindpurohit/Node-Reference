'use strict';

const mongoose = require('mongoose');
const Feed = require('./feed')
const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

const reference = new Schema({ 
    name:{type:String,required:true},
    sourceUrl: String, 
    detail: String,
    imageUrl: String,
    createdAt: Date,
    type: String,
    headline: String,
    feedReference: {type:Schema.Types.ObjectId,ref: Feed}
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Reference',reference);