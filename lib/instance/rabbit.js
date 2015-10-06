var amqp = require('amqplib/callback_api');

function Rabbit () {
	
}
Rabbit.prototype = {
	send : function (id, message) {
		this.connect(id, false, function (ch, conn) {
			ch.sendToQueue(id, new Buffer(message || 'connected'));
			setTimeout(function  () {conn.close()}, 500);
		});
	},
	receive : function (id, cb) {
		if(!id)return;
		this.connect(id, false, function (ch, conn) {
			ch.consume(id, cb);
		});
	},
	connect : function (id, durable, cb) {
		amqp.connect('amqp://localhost', function (err, conn) {
			conn.createChannel(function (err, ch) {
				ch.assertQueue(id, {durable : durable});
				cb(ch, conn);
			});
		});
		
	}
}

module.exports = new Rabbit;
