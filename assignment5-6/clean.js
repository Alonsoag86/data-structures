var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
var content = fs.readFileSync('/home/ubuntu/workspace/assignment1/data/m09.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

var finalOutput = [];

$('table table table tbody').find('tr').each(function(i, elem){
    
var missingInfo = $(elem).find('td').eq(1).html().split('<br>');
  for (var i = 0; i < missingInfo.length; i ++){
      if (missingInfo[i].match(/ From/g) !== null) {
        //console.log(missingInfo);
        var idealObject = {};
        
        $(elem).find('div.detailsBox').each(function(i, element){
        var address1 = $(element) .parent() .contents() .slice(3) .eq(3) .text() .trim();
        var address2 = address1.substring(0, address1.indexOf(','));
        var address3 = address2 + ', New York, NY';
        idealObject.googleAddress = address3.split(' ').join('+');
        });
        
         $(elem).find('div.detailsBox').each(function(i, element){
        var address1 = $(element) .parent() .contents() .slice(3) .eq(3) .text() .trim();
        var address2 = address1.substring(0, address1.indexOf(','));
        var address3 = address2 + ', New York, NY';
        idealObject.address = address3.toString();
        });
        
        var daysOfWeek = missingInfo[i].match(/Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays|Sundays/gi);
        idealObject.weekDays = daysOfWeek.toString();
        
        var startTimes = missingInfo[i].match(/\d.+/gi);
        idealObject.startTime = startTimes.toString().split(' <b>')[0];
        
        var endTimes = missingInfo[i].match(/\d.+/gi);
        idealObject.endTime = endTimes.toString().split('</b> ')[1].slice(0, -1);

        $(elem).find('div.detailsBox').each(function(i, element){
        idealObject.location = $(this) .prev() .prev() .prev() .prev() .prev() .prev() .prev() .text();
        
        $(elem).find('div.detailsBox').each(function(i, element){
        idealObject.meetingName = $(element) .parent() .contents() .slice(2) .eq(2) .text() .trim();
        
        $(elem).find('td').eq(1).each(function(i, element){
        idealObject.meetingType = $(element).html().split('<br>')[1].split('<b>Meeting Type</b>');
       
        $(elem).find('td').eq(0).each(function(i, element){
        idealObject.wheelchair = $(this) .contents() .nextAll() .slice(4) .eq(4).text() .trim();
        
        $(elem).find('div.detailsBox').each(function(i, element){
        idealObject.details = $(element) .contents() .text() .trim();
        
        
        finalOutput.push(idealObject);
        
            
        });
   
        });
        
        });
    
        });    
    });

        //console.log(idealObject);
      }
  }
  
});

require('fs').writeFile('nolatlong.json',
    JSON.stringify(finalOutput),
    function (err) {
        if (err) {
            console.error('error');
        }
    }
);

console.log(finalOutput);
