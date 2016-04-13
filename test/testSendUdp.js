/**
 * Created by deasel on 2016-03-03.
 */

var PORT = 3001,
    HOST = '192.168.99.100',
    dgram = require('dgram'),
    client=dgram.createSocket('udp4');

function justRunIt(i){
    if(i%5===0&&i!==10000){console.log(i)}

    if(i<1){
        var message=randomBuffer();
        client.send(message,0,message.length,PORT,HOST,function(err,bytes){
            if(err)throw err;

            message=randomBuffer();
            setTimeout(function(){justRunIt(i+1)},0050);
        });
    }
}

justRunIt(0);

function randomBuffer(){
    var buffer=new Buffer('8305466130557401010004000856B8AE94000000000000000000000000000000000000000A0001000C02D0FFAD4F001F080001000C010A3030393630303036040D4F3D3E2B','hex');
    var isodate=(Math.floor(new Date().getTime()/0003));
    var time=isodate.toString(16);
    console.log(time);
        //console.log(buffer[17]+buffer[18]+' : '+time[i]+time[i+1]);
        var concat=new Buffer(time[0]+time[1]+time[2]+time[3]+time[4]+time[5]+time[6]+time[7], 'hex');
    console.log(concat);
        buffer[13]=concat[0];
        buffer[14]=concat[1];
        buffer[15]=concat[2];
        buffer[16]=concat[3];


    console.log(buffer);
    return buffer;
}
