const request = require('request');
var parseString = require('xml2js').parseString;

const url = 'http://export.arxiv.org/api/query?search_query=ti:'
module.exports = {
    getDocs: function(req, res)
    {
        var str_arr = req.query.keyPhrases;
        str_arr = str_arr.split(',');

        let result = [];
        let i = 0;

        str_arr.forEach(function(str) {
            request.get(url + str + '&sortBy=lastUpdatedDate&sortOrder=ascending', (error, response, body) => {
                console.log(JSON.stringify(body));
                parseString(body, function (err, val) {
                    try{
                        val.feed.entry[0].link.forEach(link => {
                                if(link.$.title == 'pdf')
                                {
                                    result.push({"summary":  val.feed.entry[0].summary[0], "url": link.$.href});
                                }
                            });
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
        });
    }
};