// var PLAYERS_ALOUD = process.argv.pop();
// var PORT = process.argv.pop();
var express = require('express'),
	app = express(),
	// cookieParser = require('cookie-parser'),
	// requirejs = require('requirejs'),
	server = app.listen(PORT, function  () {
		// This log is used to tell instance the server is ready
		console.log('started'); // DO NOT DELETE
		console.log('Game Server started on port: ', PORT);
	});
	// _ = require('underscore'),
	// io = require('socket.io').listen(server),
	// mongoose = require('mongoose'),
	// socketCookieParser = require('socket.io-cookie-parser'),
	// bodyParser = require('body-parser');


// app.use(express.static(process.cwd() + '/client/assets'));
// app.use(express.static(process.cwd() + '/main'));
// app.use(bodyParser.urlencoded({extended : true}));
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.set('view engine', 'jade');
// app.set('views', process.cwd() + '/client');


// global.define = require('amdefine')(module);
// mongoose.connect('mongodb://localhost/assassins');
// mongoose.connect('mongodb://nate:nate12345@ds051534.mongolab.com:51534/assassins');
// var DB = require(process.cwd() + '/lib/db/connection.js');
// var db = new DB(mongoose);
// db.init();

// requirejs.config({
//     nodeRequire: require,
//     baseUrl: process.cwd() + '/main/',
//     paths : {
//     	_ : 'underscore'
//     }
// });

// io.use(socketCookieParser());


// Main
// require('./main')(requirejs, io, db, PORT, PLAYERS_ALOUD);

app.get('/', function (req ,res) {
	res.send('hi');
});
// app.get('/', function (req, res) {
// 	res.render('views/game/index');
// });
// app.get('/home', function (req, res) {
// 	res.render('views/game/home');
// });
// app.get('/account', function (req, res) {
// 	res.render('views/game/account');
// });
// app.get('/match-making', function (req, res) {
// 	res.render('views/game/matchmaking');
// });
// app.get('/game-stats', function (req, res) {
// 	res.render('views/game/gameStats');
// });
// app.get('/viewport', function (req, res) {
// 	res.render('views/game/viewport');
// });
// app.get('/character-select', function (req, res) {
// 	res.render('views/game/characterSelect');
// });
// app.get('/test', function (req, res) {
// 	res.send(true);
// });
