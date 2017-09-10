var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
var content = fs.readFileSync('/home/ubuntu/workspace/assignment1/data/m09.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

/*
$ ('td').each(function(i, element){
   if ($(element.style == 'border-bottom: 1px solid #e3e3e3; width: 260px')) {
       
      var address = $(this).contents();
      console.log (address.text());
   }
});

//too much info as a result
*/

/*
 $('div.detailsBox').each(function(i, element){
      var firstStep = $(this) .prev();
      var address = firstStep .prev() .prev() .prev() .prev() .prev() .prev();
      console.log(address.text().split("<br>"));
    });
    
//you just get the places names (not the third one tho)    
*/

$('div.detailsBox').each(function(i, element){
      var address = $(element) .parent() .contents() .slice(3) .eq(3) .text();
      console.log(address);
    });
    
//"On the Internet, nobody knows you're a dog"
//Really? Well, it seems pretty obvious that a 
//dog wrote the code for the AA meetings web page
