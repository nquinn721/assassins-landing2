var port = process.argv.slice(-1)[0];
var express = require('express'),
	app = express(),
	requirejs = require('requirejs'),
	server = app.listen(port),
	io = require('socket.io').listen(server),
	bodyParser = require('body-parser'),
	rabbit = require(process.cwd() + '/lib/instance/rabbit');


// rabbit.receive('instance-' + port, function (data) {
// 	console.log(data);
// });
// console.log(process.cwd());
// rabbit.recieve('instance-' + port, function (data) {
// 	console.log(data);
// });

// app.use(express.static(__dirname + '/client/assets'));
// app.use(express.static(__dirname + '/main'));
// app.use(bodyParser.urlencoded({extended : true}));
// app.use(bodyParser.json());
// app.set('view engine', 'jade');
// app.set('views', __dirname + '/client');

// // require('./server/lib/main')(requirejs, io);

// global.define = require('amdefine')(module);

// requirejs.config({
//     nodeRequire: require,
//     baseUrl: __dirname + '/main/',
//     paths : {
//     	_ : 'underscore'
//     }
// });


app.get('/', function (req, res) {
	rabbit.receive('instance-' + port, function (data) {
		res.send(data.content.toString());
	});
});