var fs = require('fs');
var cheerio = require('cheerio');
// load the meeting file into a variable, `content`
var content = fs.readFileSync('/home/ubuntu/workspace/assignment1/data/m09.txt');
// load `content` into a cheerio object
var $ = cheerio.load(content);
var request = require('request'); // npm install request
var async = require('async'); // npm install async

// SETTING ENVIRONMENT VARIABLES (in Linux): 
// export NEW_VAR="Content of NEW_VAR variable"
// printenv | grep NEW_VAR
var myKey = process.env.OPENKEY;
var meetingsData = [];
var finalAddress = [];


$('div.detailsBox').each(function(i, element){
      var address1 = $(element) .parent() .contents() .slice(3) .eq(3) .text() .trim();
      var address2 = address1.substring(0, address1.indexOf(','));
      var address3 = address2 + ', New York, NY';
      var address4 = address3.split(' ').join('+'); 
      finalAddress.push(address4);
      });
      
      // eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(finalAddress, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + myKey;
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(thisMeeting);
    });
    setTimeout(callback, 2000);
},
   //console.log(meetingsData);
   function() {
    fs.writeFileSync('/home/ubuntu/workspace/assignment3/zone9.txt',  JSON.stringify(meetingsData));
    console.log(meetingsData);
   
});
