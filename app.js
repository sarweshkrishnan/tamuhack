var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/tamuhack";
app.use(express.static(distDir));

app.get('/api/test', function(req, res) {
    res.send("This is a test ");
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