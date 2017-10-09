var fs = require('fs');
var request = require("request");
var cheerio = require('cheerio');
// load the meeting file into a variable, `content`
request('https://raw.githubusercontent.com/Alonsoag86/data-structures/master/assignment5-6/nolatlong.json', function(error, response, body) {
var meetings = JSON.parse(body);

// load `content` into a cheerio object
//var request = require('request'); // npm install request
var async = require('async'); // npm install async

// SETTING ENVIRONMENT VARIABLES (in Linux): 
// export NEW_VAR="Content of NEW_VAR variable"
// printenv | grep NEW_VAR
var myKey = process.env.OPENKEY;
var meetingsData = [];

      // eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(meetings, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.googleAddress;
    var thisMeeting = new Object;
    thisMeeting = value; 
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(thisMeeting);
    });
    setTimeout(callback, 500);
},
   function() {
    fs.writeFileSync('/home/ubuntu/workspace/assignment5-6/final.json',  JSON.stringify(meetingsData));
    console.log(meetingsData);
   
});

});
