let https = require ('https');
const request = require('request');

let SUBSCRIPTION_WEBSEARCH_KEY = '1765443c4eb3423dad32655c6fe7250b';

let bingsearchresults = [];
let i = 0;
let str_arr_global = [];
module.exports = {
    bingsearchloop: function(req, res){

        var str_arr = req.query.keyPhrases;
        str_arr = str_arr.split(',');
        
        let result = [];
        let i = 0;

        str_arr.forEach(function(str) {
            let options = {
                url : "https://api.cognitive.microsoft.com/bing/v7.0/search?q=" + encodeURIComponent(str),
                headers:  { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_WEBSEARCH_KEY },
            };

            request.get(options, (error, response, body) => {
                if(error)
                {
                    console.log(error);
                    return;
                }

                try{
                    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                    jsonResponse = JSON.parse(jsonResponse);
                    console.log()

                    if(jsonResponse.webPages.value[0].deepLinks!=undefined){
                        result.push({"word": str, "search_list": jsonResponse.webPages.value[0].deepLinks});
                    }

                }
                catch(err)
                {

                }
                i++;

                if(i == str_arr.length)
                {
                    console.log(result);
                    // for(var i = 0;i<result.length;i++){

                    // }

                    res.json(result);
                }
            });
        });

    }
};