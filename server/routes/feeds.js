'use strict';
const express = require('express');
const winston = require('winston');

const router = express.Router();
const User = require('../middlewares/users');
const Feed = require('../middlewares/feeds');
const Reference = require('../middlewares/db/reference');
const authController = require('../middlewares/auth/auth');
const exp = require('../middlewares/expression');
const news = require('../feature/newsScrapper');

router.get('/', (req,res) => {
    let userId;
    if(req.decoded && req.decoded.sub){
        userId = req.decoded.sub;
        Feed.getAllFeeds(userId).then((data) => {
            winston.log('info',"Get All alerts from db.");
            res.send({"success":true,"data":data,"message":"Get All alerts."});
        },
        (err) => {
            winston.log('error',"Database Error");
            res.send({"success":false,"message":"something wrong.","error":err});
        });
    }
    else{
        res.send({"success":false,"message":"Not authorize."});
    }
    
});

router.post('/',(req,res) => {
    console.log("model:"+JSON.stringify(req.body));
    let body = req.body;
    let optionalKeywords = body.optionalKeywords;
    let requiredKeywords = body.requiredKeywords;

    if(req.decoded && req.decoded.sub){
        body.creator = req.decoded.sub;
    }
    else{
        res.send({"success":false,"message":"Not authorize."});
    }

    if(body && ((optionalKeywords && optionalKeywords.length > 0) || (requiredKeywords && requiredKeywords.length > 0))){
        req.body.name = optionalKeywords[0] || requiredKeywords[0];
        Feed.saveFeed(body).then((data) => {
            let v = exp.getExpression(data);
            news.getGoogleNews(v,data._id).then((data) => {
                // res.send(data);
            },
            (err) => {
                console.log("Error:"+err);
                // res.send(err);
            });
            news.getTwitterNews(v,data._id).then((data) => {

            },
            (err) => {
                console.log("Error:"+err);
            })
            res.send({"success":true,"message":"Alert saved.","data":data});
        },
        (err) => {
            console.log("error:"+err);
            res.send({"success":false,"message":"not saved","error":err});
        });
    }
    else{
        res.send({"success":false,"messge":"Please enter one keyword min in optional or required."});
    }
    
});

router.delete('/:feedId',(req,res) => {
    Feed.deleteFeedById(req.params.feedId).then((data) => {
        Reference.deleteReferenceByFeedId(req.params.feedId).then((data) => {
            res.send({"success":true,"message":"Alert deleted successfully.","data":data});    
        },
        (err) => {
            console.log("Error:"+err);
            res.send({"success":false,"message":"Alert can't be deleted.","error":err});
        })
        
    },
    (err) => {
        console.log("Error:"+err);
        res.send({"success":false,"message":"Alert can't be deleted.","error":err});
    })
})

module.exports = router;