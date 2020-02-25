// dependencies
const express = require('express');
const bodyParser = require('body-parser');
var mongo = require('mongodb');

//var Details = mongoose.model('Details');

// Mongo Connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Costumers');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "Connection Error"));
db.once('open', function (callback) {
    console.log("Connection Successful");
});

var app = express();

// Body Parser
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Redirect Register Page
app.post('/register', function (req, res) {
    var uid = req.body.uid;
    var uname = req.body.uname;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var org = req.body.org;

    var data = {
        "uid": uid,
        "uname": uname,
        "dob": dob,
        "gender": gender,
        "org": org
    };

    // Mongo Insert
    db.collection('Details').insertOne(data, function (err, collection) {
        if (err) throw err;
        console.log("Record Inserted Successfully ");
    });

    res.send('Data stored in DB');

});

// Main Page
app.get('/', function (req, res) {
res.send('<h1>Welcome to Assignment - 3</h1>');
    
}).listen(8080);

// Get User Using ID
app.get('/user', function (req, res) {

    db.collection('Details').findOne({uid: req.query.userid}, function(err, match){

        if(err) throw err;
        else{
            res.json(match);
        }
    });
    
});


// Delete User Using ID
app.delete('/user', function(req,res){
    
    db.collection('Details').deleteOne({uid: req.query.userid}, function(err, result){
        res.send( (result === 0) ? { msg: 'Deleted' } : { msg: 'error: '+ err } );
    });
});


console.log("Listening at port 8080");