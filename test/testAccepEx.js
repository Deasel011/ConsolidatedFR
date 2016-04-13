/**
 * Created by deasel on 2016-03-15.
 */
/**
 * Created by deasel on 2016-03-03.
 */
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://192.168.99.100', function(err,conn){
    conn.createChannel(function(err,ch){
        var ex = 'frame';

        ch.assertExchange(ex,'fanout',{durable:true});

        ch.assertQueue('accep',{durable:true},function(err,q){
            ch.bindQueue(q.queue,ex,'accep');

            ch.consume(q.queue, function(msg){
                console.log(msg.content+'\n'+'Successfully received.');
                ch.ack(msg);
            },{noAck:false});
        });

    })
});