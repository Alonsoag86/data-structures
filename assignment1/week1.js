var request = require('request');
var fs = require('fs');

request('http://visualizedata.github.io/thesis/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    fs.writeFileSync('/home/ubuntu/workspace/assignment1/data/thesis.txt', body);
  }
  else {console.error('request failed')}
})