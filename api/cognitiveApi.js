const fs = require('fs');
const request = require('request');
let https = require ('https');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '8d638ec7c9734f5e8196aace92c8bfa2', 
      uriBase = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr';

//if success proceed to text analytics
// text analytics starts here ---------------------------------------------------------------------------------------------------------------------

// Replace the accessKey string value with your valid access key.
let accessKey = '194b6f78567c46d4847677737b54c25d';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
let uri = 'westcentralus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/keyPhrases';


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
    bingsearchloop: function(req, res, str_arr){
        var urls = ['http://adrianmejia.com/atom.xml', 'http://twitrss.me/twitter_user_to_rss/?user=amejiarosario'];
        var completed_requests = 0;
        str_arr = str_arr.slice(0,4);

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
    },
    key_phrase: function(req, res, str){
        let response_handler = function (response) {
            let body = '';
            response.on ('data', function (d) {
                body += d;
            });
            response.on ('end', function () {
                let body_ = JSON.parse (body);
                let body__ = JSON.stringify (body_, null, '  ');
                
                //return success here
                body__ = JSON.parse (body__);
                console.log (body__);
                console.log(body__['documents'][0]['keyPhrases']);
                module.exports.bingsearchloop(req,res,body__['documents'][0]['keyPhrases']);

            });
            response.on ('error', function (e) {
                console.log ('Error: ' + e.message);
            });
        };
  
        let get_key_phrases = function (documents) {
            let body = JSON.stringify (documents);
  
            let request_params = {
                method : 'POST',
                hostname : uri,
                path : path,
                headers : {
                    'Ocp-Apim-Subscription-Key' : accessKey,
                }
            };
  
            let req = https.request (request_params, response_handler);
            req.write (body);
            req.end ();
        }
  
        let documents = { 'documents': [
            { 'id': '1', 'language': 'en', 'text': str+'' },
        ]};
  
        get_key_phrases (documents);
      },

    ocr: function(req, res) {
        var tmp_path = req.file.path;
        var target_path = './images/' + req.file.originalname;
    
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
    
        src.on('end', function() {
          // Request parameters.
          const params = {
              'language': 'unk',
              'detectOrientation': 'true',
          };
    
          const options = {
              uri: uriBase,
              qs: params,
              headers: {
                  'Content-Type': 'application/octet-stream',
                  'Ocp-Apim-Subscription-Key' : subscriptionKey
              },
              body: fs.readFileSync(target_path)
          };
    
          let concatenate_str = '';
          request.post(options, (error, response, body) => {
            if (error) {
              console.log('Error: ', error);
              return;
            }
            let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
            
            jsonResponse = JSON.parse(jsonResponse)
            // console.log('JSON Response: ' + jsonResponse +'\n');
            try {
              for(var i = 0; i < jsonResponse.regions[0].lines.length; i++)
              {
                  var words = jsonResponse.regions[0].lines[i].words;
                  for(var j = 0; j < words.length; j++)
                  {
                    concatenate_str += words[j].text+' ';
                    // console.log("text: " + words[j].text);
                  }
              }

            }
            catch(e){
              res.send("Invalid Url.");
              return;
            }
            // console.log(concatenate_str);

            module.exports.key_phrase(req,res,concatenate_str);
            // res.sendStatus(200);
          });
        });
    
        src.on('error', function(err) { res.sendStatus(500) });  
    }
};