var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
var content = fs.readFileSync('/home/ubuntu/workspace/assignment1/data/thesis.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);


// print names of thesis students
$('h3').each(function(i, elem) {
    console.log($(elem).text());
});

// print project titles
$('.project .title').each(function(i, elem) {
    console.log($(elem).text());
});
