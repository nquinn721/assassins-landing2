module.exports = function (app, db) {
	var _ = require('underscore');


	app.post('/search-users', function (req, res) {
		if(req.body.username === ''){
			res.send('');
		}else{
			var regexp = new RegExp("^"+ req.body.username),
				friends = req.session.account.friends.map(function(v){return v._id.toString();});
			Account.find({ username: regexp}, function (err, accounts) {
				var acc = _.compact(accounts.map(function(v){
					if(v.username === req.session.account.username)return;
					return {
						username : v.username, 
						id : v._id, 
						status : v.status,
						alreadyFriend : _.contains(friends, v._id.toString())
					};
				}));
				res.send(acc);
			});
		}
	});
	app.post('/add-friend', function (req, res) {
		db.addFriend(req, req.body.user, function (err, friend) {
			var obj = {
				username : friend.username,
				id : friend._id,
				status : friend.status
			}
			res.send(obj);
		});
	});
	app.get('/get-friends-list', function (req, res) {
		res.send(req.session.account.friends);
	});
	app.post('/remove-friend', function (req, res) {
		db.removeFriend(req, req.body.user);
	});

	app.get('/chat-box', function (req, res) {
		res.render('views/site/partials/chat');
	});
	app.get('/friends-list', function (req, res) {
		res.render('views/site/partials/friends');
	})

};