/**
 * Created by deasel on 2016-04-08.
 */
/* DECLARATION & IMPORTS
 */
var configs = require('./config.js');
var udpserver = require('./udpreceiver').connect();
var frametype = require('./frametype');
var fs = require('fs');
/*var http = require('http');
var httpserver = http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Frame Receiver running on port '+configs.port);
});*/

//Déclaration pour connexion Mongo
var database = require('./database');
var mongoose = database.connect();
var framedb = database.frame83();
var deniedframelog = database.deniedframe();
var log = require('./logger');
log.init(database);

//Déclaration pour work exchange
var workexchange = require('./torabbit');

/*
 Ouverture du socket UDP puis connexion au Queue Manager
 */
udpserver.on('listening', function(){
    console.log('udp socket listening on port '+udpserver.address().port);
    setTimeout(function(){workexchange.connectExchange();
    },10000);//connecte apres 10 secondes pour laisser le temps au docker container RabbitMQ de finir de démarer

});


/*
 Logique de réception de trame GPS
 */
udpserver.on('message', function(data, remote){
    frametype.filterUdp(data,function(frame){
        if(frame){
            framedb.insert(frame, function(err,result){
                (err===null)?console.log("+ wrote to db"):log.local(err);
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
                    (err===null)? console.log("Denied frame inserted"): log.local("Denied frame not inserted");
                }
            )
        }
    })
});

process.on('uncaughtException', function(err){
    log.fatal(err);
    console.error(err);
    process.exit(1);
});