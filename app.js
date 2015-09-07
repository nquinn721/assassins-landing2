var express = require('express'),
	app = express(),
	jade = require('jade'),
	_ = require('underscore'),
	requirejs = require('requirejs'),
	server = app.listen(process.env.PORT || 3000),
	io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/client/assets'));
app.use(express.static(__dirname + '/'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/client/');

app.get('/game', function (req, res) {
	res.render('game');
});

app.get('/', function (req, res) {
	res.render('index');
});
io.on('connection', function () {
	
})
requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname + '/',
    paths : {
    	_ : 'underscore'
    }
});


require('./server/lib/main')(requirejs, io);
