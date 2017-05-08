'use strict';
const express = require('express');

const router = express.Router();
const User = require('../middlewares/users');
const Feed = require('../middlewares/feeds');
const news = require('../feature/newsScrapper');
const exp = require('../middlewares/expression');
const ref = require('../middlewares/db/reference');

router.get('/:feedId',(req,res) => {
    Feed.getFeedById(req.params.feedId).then((data) => {
        let v = exp.getExpression(data);
        // console.log("get Id:"+req.params.feedId);
        // news.getGoogleNews(v,req.params.feedId).then((data) => {
        //     // res.send(data);
        // },
        // (err) => {
        //     // res.send(err);
        //     console.log("Error:"+err);
        // });
        ref.getAllReference(1,req.params.feedId).then((data) => {
            res.send({"success":true,"data":data,"message":"Get references."});
        },
        (err) => {
            console.log("Error:"+err);
            res.send({"success":false,"error":err,"message":"getting errorr"});
        })

        // news.getTwitterNews(v,req.params.feedId).then((data) => {
        //     // res.send(data);
        // },
        // (err) => {
        //     // res.send(err);
        //     console.log("Error:"+err);
        // })
        // res.send("hi");
    },
    (err) => {
        console.log("Error:"+err);
        res.send(err);
    })
    
});

router.delete('/:referenceId',(req,res) => {
    ref.deleteReferenceById(req.params.referenceId).then((data) => {
        res.send({"success":true,"message":"Successfully deleted Reference.","data":data});
    },
    (err) => {
        console.log("Error:"+err);
        res.send({"success":false,"message":"Reference is not deleted.","error":err});
    })
});

module.exports = router;