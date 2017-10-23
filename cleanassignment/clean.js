var fs = require('fs');
var request = require('request'); 
var cheerio = require('cheerio');

var content = fs.readFileSync('/home/ubuntu/workspace/assignment1/data/m09.txt');

// I removed whitespace to see results more easily. Whitespace only ignored in XML mode
var $ = cheerio.load(content, {
    ignoreWhitespace: true,
    xmlMode: true
});

//CREATE OBJECT OUTSIDE OF LOOP AND CONDITIONAL
var finalOutput = [];


$("tbody").find('tr').each(function(i, row) {
    // iterating through rows, aka meetings
    
    var thisMeeting = new Object(); // create a new object for every meeting
    
    var firstCell = $(row).find('td').eq(0); // this is where you'll find all the information for the events. You don't need a for loop here since there's no point on repeating this information twice.
    
    thisMeeting.eventName = firstCell.find('b').text(); //get event name
    
    if (firstCell.find('h4').text() != "") {              // if there's no empty space
     thisMeeting.location = firstCell.find('h4').text();  // get location
    }                                                     // name

    thisMeeting.details = firstCell.find('div.detailsBox').contents().text().trim(); //get details
    
    thisMeeting.wheelchairAccess = firstCell.find('span').find('alt').text().replace("", 'true');
    
    thisMeeting.meetingsInformationArray = []; // create an array that will contain times, days and aditional information. This array will go inside every new object.
    
    var secondCell = $(row).find('td').eq(1); // this is where you'll find all the information for the array we just created.
    var meetingsSplit = secondCell.html().split(' <br/> <br/> <b>'); //this code will make it easier to read the contents and separate them later.

    // iterating over meeting times, days and information on the second cell.
    for (var t = 0; t < meetingsSplit.length; t++) {
        
        var thisDay = new Object(); // doing this will create a new object for every separate day as you iterate over the contents of the second cell.
        thisDay.day = meetingsSplit[t].match(/Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays|Sundays/gi).toString();
        thisDay.startTime = meetingsSplit[t].match(/\d.+/gi).toString().split(' <b>')[0]; // get start time.
        thisDay.endTime = meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[1].slice(0, 7);// get end time. It might be different for other zones. If that's the case it would be better to change slice for replace.
        thisDay.meetingType = meetingsSplit[t].match(/\d.+/gi).toString().split('</b> ')[2].replace(' <br/><b>Special Interest', "").replace(' <br/> <br/> ', ""); // get meeting type.
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
    
    console.log (finalOutput); // console log to see that the information is being added.3
});


require('fs').writeFile('./array.JSON', JSON.stringify(finalOutput, null, 1), // write a
    function(err) {                                                           // file
        if (err) {                                                            // with the
            console.error('error');                                           // json output.
        }
    }
);
