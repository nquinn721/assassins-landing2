module.exports = function (app, db, io) {
	var _ = require('underscore');

	app.get('/start-chat/:from/:to', function (req, res) {
		console.log('start chat');
		var from = req.params.from,
			to = req.params.to,
			msg = req.params.msg,
			time = req.params.time;

		db.getSessionAndAccountByUserId(to, function (acc, session) {
			if(!acc)return;

			
			var room = '/chat-' + from + '-' + to,
				isFriend = 'no',
				friends = _.pluck(req.session.account.friends, '_id');
			if(session)
				if(session.socketId && io.sockets.connected[session.socketId])
					io.sockets.connected[session.socketId].emit('startChat', room);

			for(var i = 0; i < friends.length; i++)
				if(friends[i].toString() == acc._id.toString())isFriend = 'yes';

			res.send({
				id : acc._id,
				room : room,
				user : acc.username,
				status : acc.status,
				isFriend : isFriend
			});
		});

	});
	app.post('/send-message', function (req, res) {
		console.log('send message');
		var user = req.body.user,
			room = req.body.room,
			msg = req.body.msg,
			time = req.body.time;

		db.getSessionAndAccountByUserId(user, function (acc, session) {
			var isFriend = 'no',
				obj = {
					id : req.session.accountId,
					msg : msg,
					time : time,
					user : req.session.account.username,
					status : 'active',
					room : room
				};

			for(var i = 0; i < acc.friends.length; i++)
				if(acc.friends[i] && acc.friends[i]._id == req.session.accountId)isFriend = 'yes';
			
			obj.isFriend = isFriend;

			if(session){
				io.sockets.connected[session.socketId].emit('message', obj);
				io.sockets.connected[session.socketId].emit('message-' + room, obj);
			}else{
				acc.messagesWaiting.push(obj);
				acc.save();
			}
		});
	});
	app.get('/user-status/:user', function (req, res) {
		Account.findOne({'_id' : req.params.user}, function (err, acc) {
			res.send(acc.status);
		});
	});
	app.get('/messages-waiting', function (req, res) {
		console.log('messages waiting');
		var user = req.session.accountId;
		db.getAccountByUserId(user, function (acc) {
			if(acc.messagesWaiting[0] && Object.keys(acc.messagesWaiting[0]).length > 0){
				var statuses = 0,
					messages = {};

				acc.messagesWaiting.forEach(function (v) {
					if(!messages[v.id])messages[v.id] = [];
					messages[v.id].push(v);
				});
				for(var i in messages){

					(function (i, id) {
						db.getAccountByUserId(id, function (useracc) {
							messages[i].status = useracc.status;
							statuses++;
							if(statuses === Object.keys(messages).length)send();
						});
					}(i, messages[i][0].id));
				}				
				function send(){
					acc.messagesWaiting = [];
					acc.save();
					res.send(messages);
				}
			}

		})
	});
}