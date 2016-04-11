/**
 * Created by deasel on 2016-04-08.
 */
var configs = require('../config.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: "FrameError",
    streams:[
        {
            level:'error',
            path:'/log/error.log'
        }
    ]
});*/

module.exports = {
    connect: function(){
        return mongoose.connect(configs.dburl);
    },
    frame83: function(){
        return mongoose.model('frame83', type83schema).db.collection("frame");
    },
    deniedframe: function(){
        return mongoose.model('deniedframe', deniedlog).db.collection("deniedlog");
    },
    errlogger: function(){
        return mongoose.model('errorlog', errorlog).db.collection("errorlog");
    }
};

var type83schema = new Schema({
    frame: Object
});

var deniedlog= new Schema({
    ip: String,
    date: Date,
    msg: String
});

var errorlog = new Schema({
    error: Object
});