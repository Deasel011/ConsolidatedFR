/**
 * Created by deasel on 2016-04-08.
 */
var errorlog;

module.exports = {
    init: function(database) {
        errorlog = database.errlogger();
    },
    error: function(err){
        errorlog.insert({error:JSON.stringify(err)});
    }
};