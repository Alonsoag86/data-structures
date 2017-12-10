var express = require('express'),
    app = express();
var fs = require('fs');
var moment = require('moment-timezone');

// Postgres
const { Pool } = require('pg');
var db_credentials = new Object();
db_credentials.user = 'alonsoag';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'dsdatabase';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Mongo
var collName = 'AAmeetings';
var MongoClient = require('mongodb').MongoClient;
var url = process.env.ATLAS;

// HTML wrappers for AA data
var index1 = fs.readFileSync("index1.txt");
var index3 = fs.readFileSync("index3.txt");

app.get('/', function(req, res) {
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var q = `SELECT EXTRACT(DAY FROM time AT TIME ZONE 'America/New_York') as day,
             EXTRACT(MONTH FROM time AT TIME ZONE 'America/New_York') as month,
             count(*) as num_obs, 
             round(avg(potentiometer),-1) as woke_up_on_time_greater_than_0, 
             sum(case when piezo = true then 1 else 0 end) as studying,
             sum(case when piezo = false then 1 else 0 end) as not_studying
             FROM sensors
             GROUP BY month, day;`;
             
    client.connect();
    client.query(q, (qerr, qres) => {
        res.send(qres.rows);
        console.log('responded to request');
    });
    client.end();
});

app.get('/aa', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}
        
        var dateTimeNow = new Date();
        var today = moment.tz(new Date(), "America/New_York").days();
        var tomorrow;
        if (today == 6) {tomorrow = 0;}
        else {tomorrow = today + 1}
        var hour = moment.tz(new Date(), "America/New_York").hours();
        
        //console.log(moment.tz(new Date(), "America/New_York").days());
        //console.log(moment.tz(new Date(), "America/New_York").hours());

        var collection = db.collection(collName);
    
        collection.aggregate([ // start of aggregation pipeline
            // match by day and time
            { $unwind :  "$meetingsInformationArray"},
            { $match : 
                { $or : [
                    { $and: [
                        { "meetingsInformationArray.dayNumber" : today } , { "meetingsInformationArray.startTime" : { $gte: hour } }
                    ]},
                    { $and: [
                        { "meetingsInformationArray.dayNumber" : tomorrow } , { "meetingsInformationArray.startTime" : { $lte: 4 } }
                    ]}
                ]}
            },
            
            // group by meeting group
            { $group : { _id : {
                latLong : "$address.latLong",
                meetingName : "$eventName",
                meetingAddress : "$address.street",
                meetingDetails : "$meetingDetails",
                meetingWheelchair : "$wheelchairAccess",
                },
                    meetingDay : { $push : "$meetingsInformationArray.day" },
                    meetingStartTime : { $push : "$meetingsInformationArray.from" },
                    meetingEndTime : { $push : "$meetingsInformationArray.to" },
                    meetingType : { $push : "$meetingsInformationArray.meetingType" }
            }
            },
            
            // group meeting groups by latLong
            {
                $group : { _id : { 
                    latLong : "$_id.latLong"},
                    meetingGroups : { $push : {groupInfo : "$_id", meetingDay : "$meetingDay", meetingStartTime : "$meetingStartTime", meetingEndTime : "$meetingEndTime", meetingType : "$meetingType" }}
                }
            }
        
            ]).toArray(function(err, docs) { // end of aggregation pipeline
            if (err) {console.log(err)}
            
            else {
                res.writeHead(200, {'content-type': 'text/html'});
                res.write(index1);
                res.write(JSON.stringify(docs));
                res.end(index3);
            }
            db.close();
        });
    });
    
});

// app.listen(process.env.PORT, function() {
//app.listen(3000, function() {
    //console.log('Server listening...');
//});
app.listen(process.env.PORT, function() {
// app.listen(3000, function() {
    console.log('Server listening...');
});