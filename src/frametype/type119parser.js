/**
 * Created by deasel on 2016-03-10.
 */
var Parser = require('binary-parser').Parser;

var exports=module.exports = {};

/**
 * Prend en paramêtre un BUFFER contenant la trame sans le header UDP
 * Retourne dans un callback le résultat du buffer passer en requete
 * On peut vouloir l'utiliser dans le cas de l'analyse spatiale qui
 * tirerais des trames directement à partir de la base de donnée storage
 * TODO trouver une facon de ne jamais utiliser cette fonction avec une meilleure analyse.
 */
exports.parseFrame = function(request,callback){

    callback(frameHeader.parse(request));
};

/**
 * parseFrame interne
 */
function parseFrame(request,callback){

    callback(frameHeader.parse(request));
}

/**
 * Doc Filtration des trames
 * Afin d'enlever les trames incompletes ou erronées
 * arguments[0] est l'objet passer dans le callback
 * de la fonction parseFrame(req,cb)
 * 131, 281 et 288 est l'équivalent en decimal de 83, 119 et 120 en hexa
 * et ce sont les trames que l'on veut conserver (a confirmer)
 */
exports.filterUdp = function(frame,callback){
    parseFrame(frame,function(){
        if((arguments[0].Speed!==0)
                //&&arguments[0].Heading!==0
            ){callback(arguments[0]);}
        else
            callback(false);
    })
};


/**
 * Doc frameHeader //TODO : ajouter documentation de binary-parser
 * Pour bien parser la trame UDP recue, il faut entrer la longueur
 * et le type de donnée spécifier le nom
 * a utiliser de chaque champ entre parentèse
 */

function getValue(objectX){//objectX peut être la trame au complet, et selon sa longueur totale, on peut savoir combien de champs il va y avoir a parser, donc dans les choix, on peut préparer tout les cas!
    return 1;
}
var choice1 = {};
var choice2 = {};

var frameHeader = new Parser()
    .uint8('ID')
    .choice('data',{
        tag: getValue('a'),
        choices:{
            1: choice1,
            2: choice2
        }
    })
    .uint8('checksum');


