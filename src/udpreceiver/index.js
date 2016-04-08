/**
 * Created by deasel on 2016-04-08.
 */
var dgram = require('dgram');
var configs = require('../config.js');

module.exports = {
    connect: function(){
        var server = dgram.createSocket('udp4');
        server.bind(configs.portudp);
        return server;
    }
};