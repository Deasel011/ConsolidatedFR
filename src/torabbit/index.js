/**
 * Created by deasel on 2016-04-08.
 */
var configs = require('../config.js');
var amqp = require('amqplib/callback_api');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
var log = require('../logger');

module.exports = {
    connectExchange: function() {
        connect();
    },
    sendToExchange: function(data){
        emitter.emit('toExchange', data);
    }
};

function connect() {
    amqp.connect(configs.exchangeurl,function(err,conn){
        if(err){log.error(err);}
        else {
            conn.createChannel(function (err, ch) {
                if (err) {
                    log.error(err);
                    log.local(err);
                }
                console.log("++ channel up");
                var ex = configs.exchange;

                ch.assertExchange(ex, 'fanout', {durable: true});

                emitter.addListener('toExchange', function (data) {
                    ch.publish(ex, '', new Buffer(JSON.stringify(data)));
                    console.log("+ sent to exchange");
                })
            });
        }
    });
}