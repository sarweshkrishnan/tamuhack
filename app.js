var express = require("express");
var bodyParser = require("body-parser");
var fs = require('fs');

let multer = require('multer');
let upload = multer({ dest: 'images/'});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var distDir = __dirname + "/dist/tamuhack";
app.use(express.static(distDir));
//app.use(express.static(__dirname + "/images"));

app.post('/api/test',  upload.single('image'), function(req, res) {
    var tmp_path = req.file.path;
    var target_path = 'images/' + req.file.originalname;

    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);

    src.on('end', function() { res.sendStatus(200); });
    src.on('error', function(err) { res.sendStatus(500) }); 
    
});

app.get('/image/:id', function(req, res) {
  res.sendFile(__dirname + "/images/" + req.params.id);
});

app.get('*', function(req, res) {
    res.sendFile(distDir + '/index.html');
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