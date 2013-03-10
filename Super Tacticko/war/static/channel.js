
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
	(console) && console.log( "recieved: ", m );
	var message = m.data.split('/');
	if (message[0] != clientId) {
		if (IsJsonString(message[1])) {   // the remote is ready, and just sent his board
			remoteUserPawns = JSON.parse(message[1]);
			if (remoteUserPawns.ready) {
				postStatus("Friend is ready to start the game");
				if (localUserPawns.ready)
					startGame();
			}
		} else if (message[1] == 'move') { // a pawn move
			remoteMove (message);
		} else // other message, display as is
			postStatus("Friend: " + message[1]);
		
	}
	
	
}

sendToServer = function (m) {
	var toSend = {
			action: m,
			gamekey: window.location.pathname.split('/')[2],
			player: clientId
	};
	(console) && console.log("sending: ", toSend);
	$.post("/game", toSend);
}