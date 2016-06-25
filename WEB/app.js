var express = require('express');
var app = express();
var path = require('path');

var router = express.Router();

var port = process.env.PORT || 9000; 

app.use('/assets', express.static(path.join(__dirname, 'bower_components')));
app.use('/assets', express.static(path.join(__dirname, 'controllers')));
app.use('/assets', express.static(path.join(__dirname, 'public/styles')));
app.use('/assets', express.static(path.join(__dirname, 'public/scripts')));


app.use('*', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});
app.listen(port);

console.log('Application UI layer runnign on ' + port);