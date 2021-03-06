/**
 * Created by deasel on 2016-04-08.
 */
var errorlog;
var bunyan = require('bunyan');
var errPath = require('../config.js').errPath;
var log = bunyan.createLogger({
    name: "FrameError",
    streams:[
        {level:'error',
        path: errPath+'error.log'},
        {level:'fatal',
        path: errPath+'fatal.log'}
    ],
    serializers: bunyan.stdSerializers
});


module.exports = {
    init: function(database) {
        errorlog = database.errlogger();
    },
    error: function(err){
        errorlog.insert({error:JSON.stringify(err)});
        log.error(err);
    },
    local: function(err){
        log.error(err);
    },
    fatal: function(err){
        log.fatal(err);
    }
};