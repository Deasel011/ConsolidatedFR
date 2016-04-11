/**
 * Created by deasel on 2016-04-08.
 */
var type83 = require('./type83parser.js');
var type119 = require('./type119parser.js');
var type120 = require('./type120parser.js');
var exports = module.exports = {};
var log = require('../logger');

exports.filterUdp = function (frame, callback) {
    switch (frame[0]) {
        case 131://83
            callback(type83.filterUdp(frame,callback));
            break;
        case 281://119 TODO implémenté avec la logique
            callback(type119.filterUdp(frame,callback));
            break;
        case 288://120 TODO implémenté avec la logique
            callback(type120.filterUdp(frame,callback));
            break;
        default:
            log.error("Frame Type unknown")
            callback(null);
            break;
    }
};