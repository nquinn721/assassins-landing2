var app = require('express')();

app.listen(3001);
app.get('/sup', function (req, res) {
	res.send('hi');
});