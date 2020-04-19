const express = require('express');
const app = express();
const path = require('path');

var port = 8000;

app.use(express.static(__dirname + '/'));

var server = app.listen(port, function () {
    console.log('Express app listening at port:', port)
});

app.get('/', function(req, res){
	res.sendFile('index.html');
});