define("gameServer/events", [
		'core/b2d'
	], function (b2d) {
	function Events () {
		
	}
	Events.prototype = {
		on : {

		}
	}
	var events = new Events;
	for(var i in events.on)
		socket.on(i, events.on[i]);
	return ;
});