// npm install cheerio
var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
var content = fs.readFileSync('../data/m09.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);
var output = [];
var temp;

// select the table row of each address
$('tbody tr[style = "margin-bottom:10px"]').each(function(i, elem) {
    var item = {};
    item.address = $(elem).html().split('<br>')[2].trim() + " New York, NY";
    item.wheelchair = $(elem).find('span').text().trim(); //printing wheelchair access
    item.details = $(elem).find('.detailsBox').text().trim(); //printing the details box
    // console.log(item);

    //print meeting times as an array of objects
    item.meetingtimes = $(elem).find('td').eq(1);//['style' === 'border-bottom:1px solid #e3e3e3 ;width:350px;'])) {
            temp = [];
            var timeArr = $(elem).html().trim().split('<br>');
            // an array for days, times, type, and special
            // if(timeArr[elem]){
                for (var i = 0; i < timeArr.length; i++) {    
                 if(timeArr[i].match(/ From/g) !== null) {
                    var temp = {};
                    temp.weekDay = timeArr[i].match(/Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays|Sundays/gi);
                    temp.time = timeArr[i].match(/\d.+/gi);
                    // to get meeting time
                    temp.type = timeArr[i + 1].slice(19, timeArr[i].length).trim();
                    // to get special interest
                    temp.special = null;
                    if (timeArr[i + 2].match(/special/gi) !== null) {
                      temp.special = timeArr[i + 2].slice(23, timeArr[i].length).trim();
                  item.meetingtimes.push(temp);
                  // console.log(item.meetingtimes)
// console.log(JSON.stringify(output))  
}}}});

// fs.writeFileSync('aameetings.json',JSON.stringify(output),'utf8');