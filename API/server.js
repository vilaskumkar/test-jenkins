// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');

// var fields = ['car', 'price', 'color'];
// var myCars = [
//   {
//     "car": "Audi",
//     "price": 40000,
//     "color": "blue"
//   }, {
//     "car": "BMW",
//     "price": 35000,
//     "color": "black"
//   }, {
//     "car": "Porsche",
//     "price": 60000,
//     "color": "green"
//   }
// ];
 
// json2csv({ data: myCars, fields: fields }, function(err, csv) {
//   if (err) console.log(err);
//   fs.writeFile('file.csv', csv, function(err) {
//     if (err) throw err;
//     console.log('file saved');
//   });
// });


var mongoose   = require('mongoose');
mongoose.connect('mongodb://192.168.10.62:27000/tempTW'); // connect to our database

var Bear    		  = require('./models/bear');
var CFSOrg 			  = require('./models/CFSOrganization');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding'}));
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));

var port = process.env.PORT || 9001;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9999');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.use('/downloadFile', express.static(path.join(__dirname, 'exports')));
// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
        bear.shortName = req.body.shortName;
        bear.subName = req.body.subName;
        bear.city = req.body.city;
        bear.state = req.body.state;
        bear.country = req.body.country;

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        
    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, result) {
            if (err)
                res.send(err);

            res.json(result);
        });
    });

router.route('/export')
    .post(function(req, res) {
        debugger;
        console.log(req);
        var fields = [
            '_id',
            'name',
            'shortName',
            'subName',
            'city',
            'state',
            'country'
        ];
        var myBears = [];
        myBears = req.body;

        json2csv({ data: myBears, fields: fields }, function(err, csv) {
          if (err) console.log(err);
          var exportDir = '/exports'
          var fileName = 'myBears_file_' + new Date().getTime() + '.csv';
          fs.writeFile(path.join(__dirname, exportDir, fileName), csv, function(err) {
            if (err) throw err;
            console.log('file saved as : ' + fileName);
            res.send({csvFile: fileName});
            // res.send(path.join(__dirname, exportDir, fileName));

            var filePath = path.join(__dirname, exportDir, fileName);
            var readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
            // res.sendFile(exportDir, fileName);
          });
        });
        
    });
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    // .get(function(req, res) {
    //     var fields = ['name', 'shortName', 'subName'];
    //     var myBears = [];
    //     myBears = req.body;

    //     json2csv({ data: myBears, fields: fields }, function(err, csv) {
    //       if (err) console.log(err);
    //       var fileName = 'myBears_file_' + new Date().getTime() + '_.csv';
    //       fs.writeFile(fileName, csv, function(err) {
    //         if (err) throw err;
    //         console.log('file saved as : ' + filename);
    //         res.send({csvFile: filename});
    //       });
    //     });
    //     // res.sendFile('myBears_file.csv');

    // });

router.route('/CFSOrganizations')
    .get(function(req, res) {
        // CFSOrg.find(function(err, result) {
        //     if (err)
        //         res.send(err);

        //     res.json(result);
        // });
        CFSOrg.find(function(err, records) {
		    if (err) {
		      handleError(res, err.message, "Failed to get contacts.");
		    } else {
		      res.status(200).json(records);
		    }
		  });
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);