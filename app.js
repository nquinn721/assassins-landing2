var express = require('express'),
	app = express(),
	jade = require('jade'),
	server = app.listen(3000, function(){ 
		console.log('\n**************************');
		console.log('Server started on port 3000')
		console.log('**************************\n');
	}),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	cookieParser = require('cookie-parser'),
	socketCookieParser = require('socket.io-cookie-parser'),
	bodyParser = require('body-parser'),
	fs = require('fs');

process.on('uncaughtException', function (a,b,c) {
	fs.appendFile('error.txt', a + '\n', function (err) {
	  if (err) throw err;
	});
});

// Set global environment
if(process.env.HOME.match(/\/Users\/nate/))
	global.ENV = 'dev';
else global.ENV = 'prod';

// DB Connection
if(ENV === 'dev')
	mongoose.connect('mongodb://localhost/assassins');
else
	mongoose.connect('mongodb://nate:nate12345@ds051534.mongolab.com:51534/assassins');

console.log('\n**************************');
console.log('Environment set to ' + ENV);
console.log('**************************\n');

app.use(express.static(__dirname + '/client/assets'));
app.use(express.static(process.cwd() + '/main'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'jade');
app.set('views', __dirname + '/client');

// Database
var DB = require(process.cwd() + '/lib/db/connection.js');
var db = new DB(mongoose);
db.init();
// Instance
var instanceManager = require('./lib/instance/instanceManager');
instanceManager.init(db, io);




/**
 * Middleware
 */
require('./server/middleware/middleware')(app, db, io);


/**
 * Site Routes
 */
require('./server/site/routes')(app, db, instanceManager);
require('./server/site/home/routes')(app, db, instanceManager);
/**
 * Admin Routes
 */
require('./server/admin/index')(app);
require('./server/admin/map-creator-routes')(app);
require('./server/admin/user-routes')(app, db);
/**
 * Chat Routes
 */
require('./server/chat/chat-routes')(app, db, io);
/**
 * Sockets
 */

io.use(socketCookieParser());
io.on('connection', function (socket) {
	var cookie = socket.request.cookies.al;
	db.addSocketIdToSession(cookie, socket.id);

	require('./server/site/home/sockets')(socket, io, cookie, db);
});
db.on('setAccountActive', function (acc) {
	io.emit('active', parseAccount(acc));
});
db.on('setAccountOffline', function (acc) {
	io.emit('offline', parseAccount(acc));
});
db.on('setAccountIdle', function (acc) {
	io.emit('idle', parseAccount(acc));
});
function parseAccount (acc) {
	var obj = acc.account ? 
		{username : acc.account.username, id : acc.account._id} : 
		{username : acc.username, id : acc._id};
	return obj;
}

// Final redirect
app.use(function (req, res) {
	res.redirect('/');
});
