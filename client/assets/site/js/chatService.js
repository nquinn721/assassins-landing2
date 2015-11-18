app.factory('chatService', ['$rootScope', 'session', '$compile', '$http', 'io', function ($rootScope, session, $compile, $http, socket) {
	var totalChats = 0,
		chatsOpen = [],
		closedChats = [],
		chatService = {
			startChat : function (to, msg, time) {
				var from = session.get()._id,
					self = this;

				if(chatsOpen.indexOf('chat-' + from + '-' + to) > -1 || chatsOpen.length >= 5)return;


				$http.get('/start-chat/' + from + '/' + to).then(function (chatSession) {
					var chatData = chatSession.data,
						room = chatData.room,
						username = chatData.user,
						status = chatData.status;
					self.createChat(to, room, username, status);
				});
			},
			startReceivingChat : function (chatSession) {
				if(chatsOpen.indexOf(chatSession.room) > -1)return;
				this.createChat(
					chatSession.id,
					chatSession.room, 
					chatSession.user,
					chatSession.status, 
					chatSession.time,
					(closedChats.indexOf(chatSession.room) < 0 ? chatSession.msg : null),
					true
				);
			},
			createChat : function (chatUserId, room, username, status, time, msg, receiving) {
				totalChats++;
				chatsOpen.push(room);
				if(totalChats >= 5)return;

				var chat = $compile("<chat " +
					"room='" + room + "'" +
					"userid='" + chatUserId + "'" +
					"user='" + username + "'" +
					"total-chats='" + totalChats + "'" + 
					"status='" + status + "'" +
					(time ? "time='" + time + "'" : "") +
					(msg ? "msg='" + msg + "'" : "") +
					(receiving ? "receiving='true'" : "") +
					"></chat>")($rootScope);

				$('.body').append(chat);

				$rootScope.$on('destroyed-chat-' + room, function () {
					chatsOpen.splice(chatsOpen.indexOf(room),1);
					closedChats.push(room);
					totalChats--;
					$('.chat-box').each(function () {
						if(parseInt($(this).css('right')) > 50)
							$(this).animate({right : '-=228px'});
					});
				});
			}
		
		};

	socket.on('message', function (chatSession) {
		chatService.startReceivingChat(chatSession);
	});

	$http.get('/messages-waiting').then(function (messages) {
		for(var i in messages.data){
			var info = messages.data[i][0],
				msgs = messages.data[i].map(function (v) {
				return {msg : v.msg, time : v.time};
			});
			chatService.createChat(info.id, info.room, info.user, info.status, info.time, JSON.stringify(msgs), true);
		}
	});
	return chatService;
}]);