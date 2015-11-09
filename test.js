var app = require('express')();
var spawn = require('child_process').spawn;
var p = spawn('node', [process.cwd() + '/test2.js']);
process.on('uncaughtException', function (err) {
	console.log(err);
})

app.get('/', function (req, res) {
	res.send('<a href="http://ec2-54-165-181-175.compute-1.amazonaws.com:3001">page</a>');
});

app.listen(3000);
