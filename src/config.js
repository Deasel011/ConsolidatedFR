/**
 * Created by deasel on 2016-04-08.
 */
module.exports = {
    'host': '127.0.0.1',
    'port': '8000',
    'dbtype': 'mongo',
    'dburl': 'mongodb://mongo:27017/frame', //docker link: utiliser  mongodb://mongo:27017/frame ou le nom du container mongodb est: mongo
                                            //non docker: utiliser mongodb://10.x.x.x/frame
    'portudp': '3001',
    'exchangeurl': 'amqp://rabbitmq',       //docker link: utiliser amqp://rabbitmq avec comme nom de container RabbitMq: rabbitmq
                                            //non docker: utiliser amqp://10.x.x.x
    'exchange': 'frame',                    //représente le nom du canal d'échange de rabbit
    'errPath': '/log/'
}