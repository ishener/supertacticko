
initialize = function() {
	var channel = new goog.appengine.Channel(token);
	var socket = channel.open();
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
//    socket.onerror = onError;
//    socket.onclose = onClose;
}

onOpened = function() {
	postStatus( "Connected to server." );
//	$.post("/game", {data: "this is sent from client"});
};

onMessage = function(m) {
	var message = m.data.split('/');
	if (message[0] != clientId) {
		if (IsJsonString(message[1])) {
			remoteUserPawns = JSON.parse(message[1]);
			if (remoteUserPawns.ready) {
				postStatus("Friend is ready to start the game");
				if (localUserPawns.ready)
					startGame();
			}
		} else
			postStatus("Friend: " + message[1]);
		
	}
	
	
}

sendToServer = function (m) {
	var toSend = {
			action: m,
			gamekey: window.location.pathname.split('/')[2],
			player: clientId
	};
	$.post("/game", toSend);
}