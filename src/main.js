/**
 * Created by deasel on 2016-04-08.
 */
/* DECLARATION & IMPORTS
 */
var configs = require('./config.js');
var udpserver = require('./udpreceiver').connect();
var frametype = require('./frametype');
var database = require('./database');
var mongoose = database.connect();
var framedb = database.frame83();
var deniedframelog = database.deniedframe();
var workexchange = require('./torabbit');
var log = require('./logger').init(database);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var http = require('http');
var webService = app.listen(configs.port, function(){
    console.log("Listening on port %s...", webService.address().port);
});
var io = require('socket.io').listen(webService);
var _ = require('underscore');
var frameTable = [];



/*
    Ouverture du socket UDP puis connexion au Queue Manager
 */
udpserver.on('listening', function(){
   console.log('udp socket listening on port '+udpserver.address().port);
    setTimeout(function(){workexchange.connectExchange();},10000);//connecte apres 10 secondes pour laisser le temps au docker container RabbitMQ de finir de démarer

});


/*
    Logique de réception de trame GPS
 */
udpserver.on('message', function(data, remote){
    frametype.filterUdp(data,function(frame){
        if(frame){
            (frameTable.length<=20)
                ?frameTable.unshift(frame)
                :function(){frameTable.pop();frameTable.unshift(frame)};

            framedb.insert(frame, function(err,result){
                (err===null)?console.log("+ wrote to db"):log(err);
            });
            /*spatialanaliser.analyse(frame, function(err,result){ //************ANALISE SPATIALE*********
                if(err) { log(err) }
                else if (err === null) {
            */
                workexchange.sendToExchange(frame);

             /*   }    //******************ANALISE SPATIALE***********
             }*/
        } else if (frame === null) {
            deniedframelog.insert({ip: remote.address, date: (new Date).getTime(), msg: "Frame was not of specified type"},
                function(err, result){
                    (err===null)? console.log("- logged to db"): log(err);
                }
            )
        }
    })
});

//Middleware pour permettre a d'autres sites/services d'utiliser l'API http
function allowCrossDomain(req,res,next){
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');

    var origin = req.headers.origin;
    if(origin&&_.contains(app.get('allowed_origins'),origins)){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods','GET');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/", function(req,res){
    return res.send("RESTful service 6002" +
        "    /frame = frameTable")
});

app.get("/frame", function(req,res){
    if(frameTable.length>0) {
        return res.send(frameTable);
    } else {
        return res.send("No Data");
    }
});