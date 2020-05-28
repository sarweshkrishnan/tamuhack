const fs = require('fs');
const request = require('request');
let https = require ('https');

let oxfordApi = require('./oxfordApi');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '575e1888820e4088b1a37a12fe7222cf', 
      uriBase = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr';

//if success proceed to text analytics
// text analytics starts here ---------------------------------------------------------------------------------------------------------------------

// Replace the accessKey string value with your valid access key.
let accessKey = '575e1888820e4088b1a37a12fe7222cf';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
let uri = 'westcentralus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/keyPhrases';

module.exports = {
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
                console.log("HERE-----------------------------------------");
                console.log (body__);
                // console.log(body__['documents'][0]['keyPhrases']);
                
                final = []
                body__['documents'].forEach(doc => {
                    doc.keyPhrases.forEach( phrase => {
                        final.push(phrase)
                    });
                })
                res.json(final);
                //module.exports.bingsearchloop(req,res,body__['documents'][0]['keyPhrases']);

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
        
        doc = []
        for(let i = 1; i <= str.length; i++)
        {
            doc.push({'id': i, 'language': 'en', 'text': str[i]})
        }

        let documents = { 'documents': doc};
  
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
    
          
          request.post(options, (error, response, body) => {
            if (error) {
              console.log('Error: ', error);
              return;
            }
            let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
            //console.log('JSON Response: ' + jsonResponse +'\n');
            jsonResponse = JSON.parse(jsonResponse);
            
            let result = [];

            try {
                jsonResponse.regions.forEach(region => {
                    region.lines.forEach(line => {
                        let concatenate_str = '';
                        line.words.forEach(word => {
                            concatenate_str += word.text +' ';
                        });
                        result.push(concatenate_str);
                    });
                });
y            }
            catch(e){
              
            }
            // console.log(concatenate_str);

            module.exports.key_phrase(req,res, result);
             //res.send(result);
          });
        });
    
        src.on('error', function(err) { res.sendStatus(500) });  
    }
};