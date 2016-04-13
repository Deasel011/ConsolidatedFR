/**
 * Created by deasel on 2016-04-08.
 */
var configs = require('../src/config.js');
configs.errPath = '../log/';
var udpserver = require('../src/udpreceiver').connect();
var frametype = require('../src/frametype');
var database = require('../src/database');
var logger = require('../src/logger');
configs.dburl = 'mongodb://192.168.99.100:27017/frame';
logger.error = function () {
};
logger.fatal = function () {
};
logger.local = function () {
};
logger.init = function () {
};
var buffer = randomBuffer();

var PORT = 3001,
    HOST = '192.168.99.100',
    dgram = require('dgram'),
    client = dgram.createSocket('udp4');
var amqp = require('amqplib/callback_api');

//On attrappe les erreurs possibles
process.on('uncaughtException', function (err) {
    console.error(err);
});

//On s'assure que le socket fonctionne
udpserver.on('listening', function () {
    console.log('Test connection udp ok')
    udpserver.close();
});

//On test la connexion a mongoDB
var mongoose = database.connect();
if (mongoose.connections.length < 1) {
    console.log('Test connexion MongoDB **');
    database.disconnect();
} else {
    console.log('Test connexion MongoDB OK');
    database.disconnect();
}

//On test si le filtre fait passer une trame de type 83
frametype.filterUdp(randomBuffer(), function (res) {
    frameobj=res;
    if (res) {
        if (res.OptionsByte === 131) {
            console.log("Test filtre 1 ok");
        } else {
            console.log("Test filtre 1 **")
        }
    } else if (res === null) {
        console.log("Test filtre 1 **")
    }
});

//On teste si le filtre refuse une trame de type autre
frametype.filterUdp(randomBadBuffer(), function (res) {
    if (res) {
        if (res.OptionsByte === 131) {
            console.log("Test filtre 2 **");
        } else {
            console.log("Test filtre 2 **")
        }
    } else if (res === null) {
        console.log("Test filtre 2 OK")
    }
});

//Test de réception de trame

client.send(buffer, 0, buffer.length, PORT, HOST, function (err, bytes) {
    console.log('Test envoie vers 192.168.99.100:3001');
    if (err) {
        console.log("Test envoie de Trame **");
        client.close();
    } else {
        console.log("Test envoie de Trame OK");
        client.close();
    }
});
amqp.connect('amqp://192.168.99.100', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var ex = 'frame';

        ch.assertExchange(ex, 'fanout', {durable: true});

        ch.assertQueue('test', {durable: true}, function (err, q) {
            ch.bindQueue(q.queue, ex, 'test');

            ch.consume(q.queue, function (msg) {
                console.log("Test reception Trame OK");
                ch.ack(msg);
                ch.close();
                conn.close();
            }, {noAck: false});
        });

    })
});


function randomBuffer() {
    var buffer = new Buffer('8305466130557401010004000856B8AE94000000000000000000000000000000000000000A0001000C02D0FFAD4F001F080001000C010A3030393630303036040D4F3D3E2B', 'hex');
    var isodate = (Math.floor(new Date().getTime() / 0003));
    var time = isodate.toString(16);
    var concat = new Buffer(time[0] + time[1] + time[2] + time[3] + time[4] + time[5] + time[6] + time[7], 'hex');
    buffer[13] = concat[0];
    buffer[14] = concat[1];
    buffer[15] = concat[2];
    buffer[16] = concat[3];
    return buffer;
}

function randomBadBuffer() {
    var buffer = new Buffer('8405466130557401010004000856B8AE94000000000000000000000000000000000000000A0001000C02D0FFAD4F001F080001000C010A3030393630303036040D4F3D3E2B', 'hex');
    var isodate = (Math.floor(new Date().getTime() / 0003));
    var time = isodate.toString(16);
    var concat = new Buffer(time[0] + time[1] + time[2] + time[3] + time[4] + time[5] + time[6] + time[7], 'hex');
    buffer[13] = concat[0];
    buffer[14] = concat[1];
    buffer[15] = concat[2];
    buffer[16] = concat[3];
    return buffer;
}
