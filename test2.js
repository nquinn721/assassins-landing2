var app = require('express')();

app.listen(3001);
app.get('/', function (req, res) {
	res.send('shit yea');
});