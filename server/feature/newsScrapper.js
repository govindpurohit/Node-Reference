var request = require('request');
var cheerio = require('cheerio');
var reference = require('../middlewares/db/reference');

exports.getNews = function (){
    var keyword = "ipl + gujarat";
    var news = [];
    request('https://www.google.co.in/search?q='+keyword+'&tbm=nws&tbs=qdr:h&bav=on.2,or.r_cp.&biw=1309&bih=678&dpr=1&lr=lang_en', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        console.log("*****************************");
        var mainDiv = $('div.g');
        console.log("Total News:"+mainDiv.length);
        for(var i=0;i<mainDiv.length;i++){
        // console.log("Image:"+$(mainDiv).eq(i).find('img').attr('src'));
        // console.log("Title:"+$(mainDiv).eq(i).find('a').attr('href').split('=')[1].split('&')[0]);
        // console.log("First Line:"+$(mainDiv).eq(i).find('.slp').text());
        // console.log("Detail:"+$(mainDiv).eq(i).find('.st').text());
        // console.log("--------------------");
            var time = $(mainDiv).eq(i).find('.slp').text().split('-')[1].trim().split(" ");
            var ct = getRealTime(time);
            
            var singleNews = {"title":$(mainDiv).eq(i).find('a').text().trim(),
                    "imageUrl":$(mainDiv).eq(i).find('img').attr('src'),
                    "newsUrl":$(mainDiv).eq(i).find('a').attr('href').split('=')[1].split('&')[0],
                    "headline":$(mainDiv).eq(i).find('.slp').text().split('-')[0],
                    "detail":$(mainDiv).eq(i).find('.st').text(),
                    "createdAt":ct
                    };
            
            mention.isNewsExist(singleNews).then(function(data){
                if(data === true){
                    console.log("News already Exist.");
                }
                else{
                    console.log("News saved.");
                    mention.saveNews(data);
                }
            },
            function(e){
                console.log("Error:"+e);
            })
        }
    }
    else{
        console.log("my error: "+error);
    }
    }); 
}

exports.getAllNews = function(req,res,limit){
    // mention.getAllNews(limit).then(function(data){res.send(data);});
    mention.getAllNews(limit).then(function(data){res.send(data);});
}

function getRealTime(time){
    const seconds = 60;
    var dt = new Date();
    var smh = parseInt(time[0]);

    if(time[1] == "hours" || time[1] == "hour"){
        return new Date();
    }
    else if(time[1] == "seconds" || time[1] == "second"){
        var currentSec = dt.getSeconds();
        var nd = smh<currentSec ? dt.setSeconds(currentSec-smh):dt.setSeconds(seconds-(smh-currentSec)).setMinutes(dt.getMinutes-1);
        return new Date(nd);
    }
    else if(time[1] == "minutes" || time[1] == "minute"){
        var currentMin=dt.getMinutes();
        // console.log("news "+time[1]+" minute ago");
        if(parseInt(time[0]) < currentMin){
            // var cdate = new Date().setMinutes(min-parseInt(time[1]));
            // console.log("new:"+new Date(dt.setMinutes(currentMin-parseInt(time[1]))));
            return new Date(dt.setMinutes(currentMin-parseInt(time[0])));
        }
        else{
            // console.log("today:"+time[2]);
            dt.setMinutes(seconds - (parseInt(time[0]) - currentMin));
            dt.setHours(dt.getHours()-1);
            return new Date(dt);
        }
    }
    else {
        var time = new Date(time);
        return time;
    }

}

exports.getGoogleNews = function (searchKeyword,id){
    return new Promise(function(resolve,reject){
            var keyword = searchKeyword;
            var news = [];
            request('https://www.google.co.in/search?q='+keyword+'&tbm=nws&tbs=qdr:h&bav=on.2,or.r_cp.&biw=1309&bih=678&dpr=1&lr=lang_en', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                console.log("*****************************");
                var mainDiv = $('div.g');
                console.log("Total News:"+mainDiv.length);
                for(var i=0;i<mainDiv.length;i++){
                // console.log("Image:"+$(mainDiv).eq(i).find('img').attr('src'));
                // console.log("Title:"+$(mainDiv).eq(i).find('a').attr('href').split('=')[1].split('&')[0]);
                // console.log("First Line:"+$(mainDiv).eq(i).find('.slp').text());
                // console.log("Detail:"+$(mainDiv).eq(i).find('.st').text());
                // console.log("--------------------");
                    var time = $(mainDiv).eq(i).find('.slp').text().split('-')[1].trim().split(" ");
                    var ct = getRealTime(time);
                    // console.log("google date:"+ct+" scrapper date:"+time[1]);
                    var singleNews = {"name":$(mainDiv).eq(i).find('a').text().trim(),
                            "imageUrl":$(mainDiv).eq(i).find('img').attr('src'),
                            "sourceUrl":$(mainDiv).eq(i).find('a').attr('href').split('=')[1].split('&')[0],
                            "headline":$(mainDiv).eq(i).find('.slp').text().split('-')[0],
                            "detail":$(mainDiv).eq(i).find('.st').text(),
                            "createdAt":ct,
                            "type": "news",
                            "feedReference":id
                            };
                    news.push(singleNews);
                    reference.saveReference(singleNews).then((data) => {
                        // console.log("saved singleNews");
                    },
                    (err) => {
                        console.log("single news error:"+err);
                    })
                }
                resolve(news);
            }
            else{
                console.log("my error: "+error);
                reject(error);
            }
        }); 
    });
}

exports.getTwitterNews = function (searchWord,id){
    return new Promise(function(resolve,reject){
        // var keyword = "narendra modi + india";
        var keyword = searchWord;
        var news = [];
        request('https://twitter.com/search?f=tweets&vertical=news&q='+keyword+'&l=en&src=typd', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                var tweeterNews = [];
                var mainDiv = $('ol.stream-items').children();
                console.log("Tweets:"+$(mainDiv).length);
                for(let i=0;i<$(mainDiv).length;i++){
                    // let singleTweet = {
                    //     "tweeterUserName" : mainDiv.eq(i).find('a.js-action-profile').text().trim(),
                    //     "tweeterUserUrl" : "https://twitter.com"+mainDiv.eq(i).find('a.js-action-profile').attr('href').trim(),
                    //     "tweetText" :  mainDiv.eq(i).find('p.tweet-text').text().trim(),
                    //     "tweeterProfileAvatar" :  mainDiv.eq(i).find('img.js-action-profile-avatar').attr('src').trim()
                    // }
                    // console.log("twitter timestamp:"+mainDiv.eq(i).find('span.js-short-timestamp').attr("data-time-ms"));
                    var time = mainDiv.eq(i).find('span.js-short-timestamp').attr("data-time-ms");
                    var ct = getRealTime(parseInt(time));
                    
                    var singleTweet = {
                            "name":mainDiv.eq(i).find('a.js-action-profile').text().trim().split("@")[0],
                            "imageUrl":mainDiv.eq(i).find('img.js-action-profile-avatar').attr('src').trim(),
                            "sourceUrl":"https://twitter.com"+mainDiv.eq(i).find('a.js-action-profile').attr('href').trim(),
                            "headline": "@"+mainDiv.eq(i).find('a.js-action-profile').text().trim().split("@")[1],
                            "detail": mainDiv.eq(i).find('p.tweet-text').text().trim(),
                            "createdAt":ct,
                            "type": "twitter",
                            "feedReference":id
                        };
                    tweeterNews.push(singleTweet);
                     reference.saveReference(singleTweet).then((data) => {
                        // console.log("saved singleNews");
                    },
                    (err) => {
                        console.log("single tweet error:"+err);
                    })
                } 
                resolve(tweeterNews);
            }
            else{
                console.log("my error: "+error);
                reject(error);
            }
        });
    }); 
}