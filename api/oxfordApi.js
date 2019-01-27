const request = require('request');

const appID = '425c31f4',
    appKey = 'e027e96761fd25469d9122e7361f8644',
    url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/';

module.exports = {
    getMeanings: function(req, res)
    {
        var str_arr = req.query.keyPhrases;
        str_arr = str_arr.split(',');
        
        let result = [];
        let i = 0;

        str_arr.forEach(function(str) {
            let options = {
                url : url + 'en/' + str.toLowerCase(),
                headers : {
                    'app_id': appID,
                    'app_key': appKey
                }
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

                    result.push({"word": str, "meaning": jsonResponse.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]});
                }
                catch(err)
                {

                }
                i++;

                if(i == str_arr.length)
                {
                    res.json(result);
                }
            });
        });

    }
}