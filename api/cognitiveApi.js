const fs = require('fs');
const request = require('request');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '8d638ec7c9734f5e8196aace92c8bfa2', 
      uriBase = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr';

module.exports = {
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
            console.log('JSON Response: ' + jsonResponse +'\n');
            try {
              for(var i = 0; i < jsonResponse.regions[0].lines.length; i++)
              {
                  var words = jsonResponse.regions[0].lines[i].words;
                  for(var j = 0; j < words.length; j++)
                  {
                    concatenate_str += words[j].text+' ';
                     console.log("text: " + words[j].text);
                  }
              }
            }
            catch(e){
              res.send("Invalid Url.");
              return;
            }
    
            res.sendStatus(200);
          });
        });
    
        src.on('error', function(err) { res.sendStatus(500) });  
    }
};