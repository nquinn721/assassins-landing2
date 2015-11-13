module.exports = function (app) {
	function isAdmin(req, res, next) {
	    if (req.session.account.admin)
	        return next();
	    res.redirect('/');
	}

	app.get('/all-users', isAdmin, function (req, res) {
		Account.find().exec(function (err, users) {
			res.send(users);
		});
	});
	app.get('/all-sessions', isAdmin, function (req, res) {
		Session.find().exec(function (err, sessions) {
			res.send(sessions);
		});
	});
	app.post('/delete-session', isAdmin, function (req, res) {
		Session.remove({'_id': req.body.session}).exec();
	});
	app.post('/delete-user', isAdmin, function (req, res) {
		var user = req.body.user;
		Account.remove({'_id' : user}).exec();
	});
	app.post('/update-user', isAdmin, function (req, res) {
		Account.findOne({'_id' : req.body._id}, function (err, user) {
			for(var i in req.body)user[i] = req.body[i];
			user.save();
		});
	});
	app.post('/create-user', isAdmin, function (req, res) {
		Character.find().exec(function (e, chars) {
			var acc = new Account(req.body);
			acc.characters = chars.map(function(v){return v._id;});
			acc.save();

			res.send(acc);
			
		});
	});
}