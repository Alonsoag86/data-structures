// npm install mongodb

var request = require('request');

// IN MONGO exists a database `aameetings` with a collection `zone9meetings`
var dbName = 'aameetings'; // name of Mongo database (created in the Mongo shell)
var collName = 'zone9meetings'; // name of Mongo collection (created in the Mongo shell)

request('https://raw.githubusercontent.com/Alonsoag86/data-structures/master/assignment3/zone9.txt', function(error, response, body) {
    var aaMeetingsData = JSON.parse(body);

    // Connection URL
    var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; 

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection(collName);

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        collection.insert(aaMeetingsData);
        db.close();

    }); //MongoClient.connect

}); //request