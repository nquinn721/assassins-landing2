var app = require('express')();
var spawn = require('child_process').spawn;
var p = spawn('node', [process.cwd() + '/test2.js']);
var io = require('socket.io');

io.listen(app.listen(3000));
process.on('uncaughtException', function (err) {
	console.log(err);
})

app.get('/', function (req, res) {
	res.send('<iframe src="http://ec2-54-165-181-175.compute-1.amazonaws.com:3001"></iframe>');
});

io.on('connection', function (socket) {
	socket.emit('hi');
});