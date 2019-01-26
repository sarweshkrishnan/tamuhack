const request = require('request');
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());


var distDir = __dirname + "/dist/tamuhack";
app.use(express.static(distDir));

app.get('/api/test', function(req, res) {
    
    // console.log(req.query.url != null) 

    // Replace <Subscription Key> with your valid subscription key.
    const subscriptionKey = '8d638ec7c9734f5e8196aace92c8bfa2';
    const uriBase =
    'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr';

    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/' +
    'Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png';

    // Request parameters.
    const params = {
        'language': 'unk',
        'detectOrientation': 'true',
    };

    const options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    };

    request.post(options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log('JSON Response\n');
      jsonResponse = JSON.parse(jsonResponse)

      for(var i = 0; i < jsonResponse.regions[0].lines.length; i++)
      {   var words = jsonResponse.regions[0].lines[i].words;
          for(var j = 0; j < words.length; j++){
            console.log("text: " + words[j].text);
          }
      }

    });

    res.send("This is a test");
});

app.get('/api/test2', function(req, res) {
  res.send("This is a test 2");
});

app.get('*', function(req, res) {
    res.sendfile(distDir + '/index.html');
});

// Initialize the app.
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});


/*
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");
});
*/