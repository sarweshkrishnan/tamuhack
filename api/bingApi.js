let https = require ('https');

let SUBSCRIPTION_WEBSEARCH_KEY = '1765443c4eb3423dad32655c6fe7250b';

module.exports = {
    bingsearch: function(req, res, query){
        https.get({
            hostname: 'api.cognitive.microsoft.com',
            path:     '/bing/v7.0/search?q=' + encodeURIComponent(query),
            headers:  { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_WEBSEARCH_KEY },
          }, res => {
            let body = ''
            res.on('data', part => body += part)
            res.on('end', () => {
              for (var header in res.headers) {
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-")) {
                  console.log(header + ": " + res.headers[header])
                }
              }
              console.log('\nJSON Response:\n')
              console.dir(JSON.parse(body), { colors: false, depth: null })
            })
            res.on('error', e => {
              console.log('Error: ' + e.message)
              throw e
            })
          })
    },
    
    bingsearchloop: function(req, res){
        var str_arr = req.query.keyPhrases;

        str_arr = str_arr.split(',');
        str_arr = str_arr.slice(0,4);

        var completed_requests = 0;

        var result = [];
        str_arr.forEach(function(str) {
            var responses = [];
            // http.get(url, function(res) {
            //     res.on('data', function(chunk){
            //     responses.push(chunk);
            //     });

            //     res.on('end', function(){
            //     if (completed_requests++ == urls.length - 1) {
            //         // All downloads are completed
            //         console.log('body:', responses.join());
            //     }      
            //     });
            // });

            https.get({
                hostname: 'api.cognitive.microsoft.com',
                path:     '/bing/v7.0/search?q=' + encodeURIComponent(str),
                headers:  { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_WEBSEARCH_KEY },
            }, res => {
                let body = ''
                res.on('data', part => {body += part; responses.push(body);})
                res.on('end', () => {
                    if (completed_requests++ == str_arr.length - 1) {
                        
                        // All downloads are completed
                        for (var header in res.headers) {
                            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-")) {
                            console.log(header + ": " + res.headers[header])
                            }
                        }
                        console.log('\nJSON Response:\n')
                        console.dir(JSON.parse(body), { colors: false, depth: null })

                        console.log('body:', responses.join());
                        // res.send(responses.join());
                        result.push(responses);
                    } 
                })
                res.on('error', e => {
                    console.log('Error: ' + e.message)
                    throw e
                })
            })
        })
        console.log(result);
        res.json(result);
    }
};