var fs = require('fs');
var request = require('request'); 
var cheerio = require('cheerio');
var async = require('async');

var content = fs.readFileSync('/home/ubuntu/workspace/assignment1/data/m09.txt');

// I removed whitespace to see results more easily. Whitespace only ignored in XML mode
var $ = cheerio.load(content, {
    ignoreWhitespace: true,
    xmlMode: true
});

//CREATE OBJECT OUTSIDE OF LOOP AND CONDITIONAL
var finalOutput = [];

populateArray();

function populateArray () {
    $("tbody").find('tr').each(function(i, row) {
        // iterating through rows, aka meetings
        
        var thisMeeting = new Object(); // create a new object for every meeting
        
        var firstCell = $(row).find('td').eq(0); // this is where you'll find all the information for the events. You don't need a for loop here since there's no point on repeating this information twice.
        
        var name = firstCell.find('b').text(); // get event name
        var firstName = name.substr(0, name.indexOf('-') - 1); // get first part of the event name
        var secondName = name.substr(name.indexOf('-') + 2); // get second part of the event name
        if (firstName == secondName.toUpperCase()) {
        thisMeeting.eventName = firstName;
        } else if (secondName == "") {
        thisMeeting.eventName = firstName;    
        } else if (firstName != secondName) {
        thisMeeting.eventName = firstName + " " + secondName.split(' - ')[0] } else {
        thisMeeting.eventName = secondName.toUpperCase();    
        }
        //console.log(thisMeeting.eventName);

        if (firstCell.find('h4').text() != "") {              // if there's no empty space
         thisMeeting.location = firstCell.find('h4').text();  // get location
        }                                                     // name
    
        if (firstCell.find('div.detailsBox').contents().text().trim() != ""){
        thisMeeting.details = firstCell.find('div.detailsBox').contents().text().trim(); //get details
        }
        thisMeeting.wheelchairAccess = firstCell.find('span').find('alt').text().replace("", 'true'); // get wheelchair acess. If the meeting has it, then = true.
        
        thisMeeting.meetingsInformationArray = []; // create an array that will contain times, days and aditional information. This array will go inside every new object.
        
        var secondCell = $(row).find('td').eq(1); // this is where you'll find all the information for the array we just created.
        var meetingsSplit = secondCell.html().split(' <br/> <br/> <b>'); //this code will make it easier to read the contents and separate them later.
        // iterating over meeting times, days and information on the second cell.
        for (var t = 0; t < meetingsSplit.length; t++) {
        //console.log(meetingsSplit);    
            var thisDay = new Object(); // doing this will create a new object for every separate day as you iterate over the contents of the second cell.
            thisDay.day = meetingsSplit[t].match(/\w.+/gi).toString().split(' <b>')[0].split(' From')[0].replace('b>', '');
            if (thisDay.day == 's') {
            thisDay.day = 'Sundays';    
            }
            //console.log(thisDay.day);
            //thisDay.day = meetingsSplit[t].match(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/gi).toString();
            //console.log(thisDay.day);
            //thisDay.dayNumber = meetingsSplit[t].match(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/gi).toString();
            if (thisDay.day === 'Sundays') {
            thisDay.dayNumber = 0;
            } else if (thisDay.day === 'Mondays') {
            thisDay.dayNumber = 1;
            } else if (thisDay.day === 'Tuesdays') {
            thisDay.dayNumber = 2;
            } else if (thisDay.day === 'Wednesdays') {
            thisDay.dayNumber = 3;    
            } else if (thisDay.day === 'Thursdays') {
            thisDay.dayNumber = 4;    
            } else if (thisDay.day === 'Fridays') {
            thisDay.dayNumber = 5;    
            } else if (thisDay.day === 'Saturdays') {
            thisDay.dayNumber = 6;
            }
            var firstTime = meetingsSplit[t].match(/\d.+/gi).toString().split(' <b>')[0];
            var separate = firstTime.split(' ');
            var timeOfDay = separate[1];
            if (timeOfDay == 'P') {
            timeOfDay = 'PM';    
            }
            var stepOne = separate[0];
            var stepTwo = stepOne.split(':');
            var hour = +stepTwo[0];
            var minute = +stepTwo[1];
            if (timeOfDay === 'AM' && hour === 12) {
            thisDay.startTime = 00 + '.' + minute;
            }
            if (timeOfDay === 'PM' && hour < 12) {
            thisDay.startTime = hour + 12 + '.' + minute;
            } else {
            thisDay.startTime = hour + '.' + minute;
            }
            thisDay.startTime = +thisDay.startTime * 1;
            var secondTime = meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[1].slice(0, 7);
            var separateTwo = secondTime.split(' ');
            var timeOfDayTwo = separateTwo[1];
            if (timeOfDayTwo == 'P') {
            timeOfDayTwo = 'PM';    
            }
            var stepOneEndTime = separateTwo[0];
            var stepTwoEndTime = stepOneEndTime.split(':');
            var hourTwo = +stepTwoEndTime[0];
            var minuteTwo = +stepTwoEndTime[1];
            if (timeOfDayTwo === 'AM' && hourTwo === 12) {
            thisDay.endTime = 00 + '.' + minuteTwo;
            }
            if (timeOfDayTwo === 'PM' && hourTwo < 12) {
            thisDay.endTime = hourTwo + 12 + '.' + minuteTwo;
            } else {
            thisDay.endTime = hourTwo + '.' + minuteTwo;
            }
            thisDay.endTime = +thisDay.endTime * 1;
            //console.log(thisDay.endTime);
            thisDay.from = firstTime;
            thisDay.to = secondTime;
            //thisDay.startTime = meetingsSplit[t].match(/\d.+/gi).toString().split(' <b>')[0]; // get start time.
            //thisDay.endTime = meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[1].slice(0, 7);// get end time. It might be different for other zones. If that's the case it would be better to change slice for replace.
            if (typeof meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[2] != 'undefined'){
            thisDay.meetingType = meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[2].replace(' <br/><b>Special Interest', "").replace(' <br/> <br/> ', "");    
            }
            //thisDay.meetingType = meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[2].replace(' <br/><b>Special Interest', "").replace(' <br/> <br/> ', ""); // get meeting type.
            if (typeof meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[3] != 'undefined') { // writing this conditional will allow the program to continue its work if it doesn't encounter any undefined elements.
                thisDay.specialInterest = meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[3].replace(' <br/> <br/> ', ""); // get special interest
            }
            
            thisMeeting.meetingsInformationArray.push(thisDay); // push all the information to: a) meetingsInformationArray, and then to b) thisMeeting.
        }
        
        var thisAddress = new Object ();
        var address1 = firstCell.contents().eq(6).text().trim();
        var address2 = address1.substring(0, address1.indexOf(','));
        var address3 = address2 + ', New York, NY';
        thisAddress.street = address3.toString();
        
        thisMeeting.address = thisAddress;
        
        
        finalOutput.push(thisMeeting); // push everything to your outer most array.
        
        //console.log (finalOutput); // console log to see that the information is being added.
    });
    

async.eachSeries(finalOutput, lookUpGeos, makeJSON);
}


function lookUpGeos(meeting, callback){
    //console.log(meeting);
    var value = meeting.address.street;
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+');
    console.log(apiRequest);
    request(apiRequest, function(err, resp, body) {
         if (err) {throw err;}
         meeting.address.latLong = JSON.parse(body).results[0].geometry.location;
         
     });
     setTimeout(callback, 1000);
}

function makeJSON() {
require('fs').writeFile('./zone09array.JSON', JSON.stringify(finalOutput, null, 1));
}
