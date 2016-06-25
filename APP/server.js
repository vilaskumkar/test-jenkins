var express = require('express');
var app = express();

var port = process.env.PORT || 9002;

app.get('/', function(req, res){
        res.send('Hello World, This is APP Layer');
});

app.listen(port, function(){
        console.log('Your test application is running on port ' + port);
})

