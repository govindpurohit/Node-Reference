

exports.getExpression = function(feed){
     let requiredKeywordsExp = '';
     let optionalKeywordsExp = '';
     let excludedKeywordsExp = '';

    if(feed && feed.requiredKeywords && feed.requiredKeywords.length > 0){
        requiredKeywordsExp = getRequiredkeywords(feed.requiredKeywords);
    }
    if(feed && feed.optionalKeywords && feed.optionalKeywords.length > 0){
        optionalKeywordsExp = getOptionalKeywords(feed.optionalKeywords); 
    }
    if(feed && feed.excludedKeywords && feed.excludedKeywords.length > 0){
        excludedKeywordsExp = getExcludedKeywords(feed.excludedKeywords);
    }
    // console.log("exp:"+requiredKeywordsExp + " "+optionalKeywordsExp+" "+excludedKeywordsExp);
    return requiredKeywordsExp + " "+optionalKeywordsExp+" "+excludedKeywordsExp;
}

function getRequiredkeywords(keywords){
    let expression = '';
    for(let i=0;i<keywords.length;i++){
        if(i === keywords.length-1){
            expression += keywords[i];
        }
        else{
            expression+= keywords[i]+" "; 
        }
    }
    return expression;
}

function getOptionalKeywords(keywords){
    let expression = '';
    for(let i=0;i<keywords.length;i++){
        if(i === keywords.length-1){
            expression += keywords[i];
        }
        else{
            expression+= keywords[i]+" OR "; 
        }
    }
    return expression;
}

function getExcludedKeywords(keywords){
    let expression = '';
    for(let i=0;i<keywords.length;i++){
        expression+= " -" + keywords[i]; 
    }
    return expression;
}
