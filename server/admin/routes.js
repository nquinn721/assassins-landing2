module.exports = function (app) {
	function isAdmin(req, res, next) {
	    if (req.session.account.admin)
	        return next();
	    res.redirect('/');
	}

	app.get('/admin', isAdmin, function (req, res) {
		res.render('views/admin/index', {page : 'admin'});
		
	});
	app.get('/all-users', isAdmin, function (req, res) {
		Account.find().exec(function (err, users) {
			res.send(users);
		});
	})
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
		var acc = new Account(req.body);
		acc.save();

		res.send(acc);
	});
}