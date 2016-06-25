// models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema   = new Schema({
    name : String,
    shortName : String,
    subName : String,
    city : String,
    state : String,
    country : String
});

module.exports = mongoose.model('bears', BearSchema);