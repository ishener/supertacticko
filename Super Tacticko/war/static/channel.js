
initialize = function() {
	var channel = new goog.appengine.Channel(token);
	var socket = channel.open();
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
//    socket.onerror = onError;
//    socket.onclose = onClose;
}

onOpened = function() {
	postStatus( "channel opened" );
	$.post("/game", {data: "this is sent from client"});
};

onMessage = function(m) {
	postStatus(m.data);
}