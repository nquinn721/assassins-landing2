#!/usr/bin/env node
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (err, conn) {
	conn.createChannel(function (err, ch) {
		var q = 'hello';

		ch.assertQueue(q, {durrable : false});
		ch.sendToQueue(q, new Buffer('Hello Wolrd!'));
		console.log(" [x] Sent 'Hello World!'");

		setTimeout(function  () {
			conn.close();
			process.exit(0)
		}, 500);
	});
});

