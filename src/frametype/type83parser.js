/**
 * Created by deasel on 2016-04-08.
 */
var Parser = require('binary-parser').Parser;

var exports=module.exports = {};

/*
    Fonction pour parser en asynchrone la trame recue
 */
function parseFrame(request,callback){

    callback(frameHeader.parse(request));
}

/*

 */
exports.filterUdp = function(frame,callback){
    parseFrame(frame,function(){
        if(arguments[0].OptionsByte===131 //TODO : valider les champs a vérifier
        //&&arguments[0].Speed!==0
        //&&arguments[0].Heading!==0
        ){callback(arguments[0]);}
        else
            callback(false);
    })
};

/*
    La déclaration du parseur avec les différents types des
    attributs de l'objet JSON qui sera retourné
 */
var frameHeader = new Parser()
    .uint8('OptionsByte')
    .uint8('MobileIDLength')
    .array('MobileID',{type:'uint8',length:'MobileIDLength'})
    .uint8('MobileIDLen')
    .bit8('MobileIDType')
    .uint8('Service_Type')
    .uint8('Message_Type')
    .uint16('Sequence_Nu')
    .uint32('UpdateTime')
    .uint32('TimeOfFix')
    .floatbe('Latitude')
    .floatbe('Longitude')
    .floatbe('Altitude')
    .int32('Speed')
    .int16('Heading')
    .uint8('Satellites')
    .uint8('FixStatus')
    .uint16('Carrier')
    .uint16('RSSI')
    .uint8('CommState')
    .uint8('HDOP')
    .uint8('Inputs')
    .uint8('UnitStatus')
    .uint8('User_Msg_Route')
    .uint8('User_Msg_ID')
    .uint16('User_Msg_Length')
    .array('User_Msg',{type:'uint8',length:'User_Msg_Length'});