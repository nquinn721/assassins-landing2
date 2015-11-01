var amqp = require('amqplib/callback_api');

function Rabbit () {
	
}
Rabbit.prototype = {
	send : function (id, message) {
		this.connectAndCreate(id, false, function (ch, conn) {
			ch.sendToQueue(id, new Buffer(message || 'connected'));
			setTimeout(function  () {conn.close()}, 500);
		});
	},
	receive : function (id, cb) {
		if(!id)return;
		this.connectAndCreate(id, false, function (ch, conn) {
			ch.consume(id, cb);
		});
	},
	connect : function (cb) {
		amqp.connect('amqp://localhost', function (err, conn) {
			cb(conn);
		});
		
	},
	create : function (id, durable, conn, cb) {
		conn.createChannel(function (err, ch) {
			ch.assertQueue(id, {durable : durable});
			cb(ch, conn);
		});
	},
	connectAndCreate : function (id, durable, cb) {
		var self = this;
		this.connect(function (conn) {
			self.create(id, durable, conn, cb);
		})
	},
	clear : function (id) {
		console.log('clear', id);
		this.connect(function (conn) {
			conn.queue_delete(id);
		})
	}
}

module.exports = new Rabbit;
