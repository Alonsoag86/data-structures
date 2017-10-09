var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
var content = fs.readFileSync('/home/ubuntu/workspace/assignment1/data/m09.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);


var finalAddress = [];
var wheelchair = [];
var meetingName = [];
var locationName = [];



 $('div.detailsBox').each(function(i, element){
      var location = $(this) .prev() .prev() .prev() .prev() .prev() .prev() .prev() .text();
      locationName.push(location);
    });
//Code for the location name (not the third one tho)    



$('div.detailsBox').each(function(i, element){
      var address = $(element) .parent() .contents() .slice(3) .eq(3) .text() .trim();
      finalAddress.push(address);
      });
    
//"On the Internet, nobody knows you're a dog"
//Really? Well, it seems pretty obvious that a 
//dog wrote the code for the AA meetings web page

//Code for the address


$('div.detailsBox').each(function(i, element){
      var meetingName1 = $(element) .parent() .contents() .slice(2) .eq(2) .text() .trim();
      meetingName.push(meetingName1);
      console.log(meetingName);
      });
//This code gets you the meeting name





$ ('td').each(function(i, element){
   if ($(element.style == "border-bottom:1px solid #e3e3e3;width:350px;")) {
       
      var wheelchair1 = $(this) .contents() .nextAll() .slice(4) .eq(4);
      wheelchair.push(wheelchair1.text() .trim());
   }
});

console.log(finalAddress);
console.log(locationName);
console.log (wheelchair);
console.log(meetingName);