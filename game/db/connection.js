define("game/db/connection", [
		'fs'
	], function (fs) {


	function DB () {
		this.db = db;
		this.connection = db.connection;
	}

	DB.prototype = {
		init : function () {
			this.connection.on('error', this.dbFailed.bind(this));
			// this.connection.once('open', this.connected.bind(this));
			this.setupModels();
			// this.createAccount();
		},
		connected : function () {
			console.log('DB connected!');
		},
		setupModels : function () {
			var models = fs.readdirSync('./game/db/models');

			// for(var i = 0; i < models.length; i++)
			// 	require('game/db/models/' + models[i]);
			require('game/db/models/account');

		},
		createAccount : function () {
			var account = new Account({
				username : 'nate',
				password : 'nate123',
				firstName : 'Nate',
				lastName : 'Quinn',
				email : 'natethepcspecialist@gmail.com'
			});
			console.log(account);
			account.save(function (err) {
				if(err)throw new Error(err);
			});
		},
		login : function (username, password, cb, failcb) {
			Account.findOne({username : username}, function (err, acc) {
				if(acc)
					acc.verifyPassword(password, function(err, isMatch) {
						var account = {
							username : true,
							firstName : true,
							lastName : true,
							gold : true,
							xp : true,
							email : true,
							_id : true
						}
			            if (err) throw err;
			            if(!isMatch)failcb();
			            else {
			            	for(var i in account)
			            		account[i] = acc[i];
			            	cb(account);
			            }
			        });
			});
		},
		loginId : function (id, cb) {
			Account.findOne({_id : id}, function (err, acc) {
				if(err)throw new Error;
				else cb(acc);
			})	
		},
		dbFailed : function () {
		 	console.error.bind(console, 'connection error:');
		}
	}
	return new DB();
});