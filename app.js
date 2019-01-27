var express = require("express");
var bodyParser = require("body-parser");
let multer = require('multer');

const cognitiveApi = require('./api/cognitiveApi.js');
const bingApi = require('./api/bingApi');
const oxfordApi = require('./api/oxfordApi');

let upload = multer({ dest: 'images/'});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var distDir = __dirname + "/dist/tamuhack";
app.use(express.static(distDir));

app.post('/api/getKeyPhrases', upload.single('image'), cognitiveApi.ocr);

app.get('/api/getMeanings', oxfordApi.getMeanings)

app.get('/api/getBingSearch', bingApi.bingsearchloop);

app.get('*', function(req, res) {
    res.sendFile(distDir + '/index.html');
});

// Initialize the app.
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// app.get('/images/:id', function(req, res) {
//   res.sendFile(__dirname + "/images/" + req.params.id);
// });