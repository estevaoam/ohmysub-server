var express = require('express');
var app = express();
var xmlrpc = require('xmlrpc');

var getSubtitleForHash = function(language, hash, size) {
  var uri = 'api.opensubtitles.org/xml-rpc';
  var client = xmlrpc.createClient({ host: 'api.opensubtitles.org', path: '/xml-rpc' })

  client.methodCall('LogIn', ['', '', 'en', 'OS Test User Agent'],
    function (error, value) {
      var token = value.token,
          result = {},
          queryBody = {
            'moviehash': hash,
            'sublanguageid': language,
            'moviebytesize': size
          }

          client.methodCall('SearchSubtitles', [token, queryBody],
            function(error, res){
              console.log(res);
            }
          );
    }
  );
}

app.get('/subtitle/:language/:hash/:size', function(req, res){
  var subHash = req.params.hash;
  var size = req.params.size;
  var language = req.params.language;

  if (hash && language && size) {
    res.send(200, getSubtitleForHash(hash));
  } else {
    res.send(500, { error: 'You need to specify the hash, size and language.' });
  }
});

app.listen(80);

getSubtitleForHash('', '', '');
