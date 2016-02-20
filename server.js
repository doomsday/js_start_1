/*
var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function (request, response) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       response.end( data );
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})*/
var http = require("http");

http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello World");
    response.end();
}).listen(8888);