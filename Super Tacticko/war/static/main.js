var zoom = 0;
var newGame = true;
var localUserPawns;
var remoteUserPawns = false;
var whoseTurn;
var gameState = 'placing';

$(function() {
	
	setCellSize();
	$(window).resize(function() {
		setCellSize();
	});
	if (newGame) startLayout();
	$( ".pawn-img-draggable" ).draggable({ 
		revert: 'invalid',
		revertDuration: 0,
		cursor: 'pointer',
		cursorAt: {
			top: $('td').height() / 2,
			left: $('td').width() / 2
		},
		start: function( event, ui ) {
			ui.helper.width( $('td').width() ).height( $('td').height() );
			ui.helper.removeClass('inside-td');
		},
		stop: function( event, ui ) {
			ui.helper.width( 30 ).height( 'auto' );
		}
	});
	$('td').droppable({
		hoverClass: "ui-state-active",
		drop: function( event, ui ) {
			if (ui.draggable.parent().hasClass('pawn-box'))
				ui.draggable.parent().hide();
	        ui.draggable.appendTo (this);
	        localUserPawns.pawns[ui.draggable.attr('serial')].setPos(
	        	$(this).attr('posx'),
	        	$(this).attr('posy')
	        );
	        ui.draggable.addClass('inside-td');
	        if ( gameState == 'inprogress' ) {
	        	movePawn (ui.draggable.attr('serial'), $(this).attr('posx'), $(this).attr('posy'));
	        } else if ($('.pawn-box:visible').length == 0) {
	        	// finished placing pawns. show ready button
	        	if ( !$('#ready-game').is(':visible') )
	        		showReady();
	        }
	    }
	});
	$('td.td-disabled').droppable( "option", "disabled", true );
	
	$(window).bind('mousewheel', function(event, delta, deltaX, deltaY) {
		event.preventDefault();
	    zoom += delta;
	    var zoomScale = 5; // how many pixels the cell enlarges with each zoom point
	    $('td').height( $('td').first().height() + 1 + (delta*zoomScale) );
	    console.log($('td').first().height() , zoom, zoomScale);
		$('table').width( $('table').width() + (width*zoomScale*delta) );
		return false;
	});
	if ( $('body').hasClass('create-page') ) {
		// add the middle line
		var half = height / 2; // it has to be zugi anyway
		var $middle = $('tr').slice(half-1, half);
		$middle.find('td').addClass('middle-td');
		$middle.next().find('td').css('border-bottom', '0');
	}
	$('.share-input').click(function() { $(this).select(); });
	$('.create-page td').click(function() {
		var row = $(this).attr('posy');
		var col = $(this).attr('posx');
		var mirrorRow = width - 1 - row;
		if ( mapData[row][col] === 1 ) {
			mapData[row][col] = 0;
			$('#td'+ col + 'x' + mirrorRow).removeClass('land-td');
			mapData[mirrorRow][col] = 0;
			$(this).removeClass('land-td');
		} else {
			mapData[row][col] = 1;
			$(this).addClass('land-td');
			$('#td'+ col + 'x' + mirrorRow).addClass('land-td');
			mapData[mirrorRow][col] = 1;
		}
	});
	
	$('#save-map').click(function() {
		$.post(	'/create_map', 
				{ map : JSON.stringify(mapData)  } , 
				function(data) {
					// we got back the map id
					var link = "http://" + document.domain + ":" + window.location.port + 
								"/game/?map=" + data;
					$('#newmap-p a').attr("href", link).html(link);
					$.fancybox({
						'href' : '#created-map',
						'closeBtn' : false
					});
				}
		);
	});
	
	$('#chat-form').submit(function(){
		var $chatInput = $(this).find('.chat-input');
		if ( $.trim($chatInput.val()) == '' ) return false;
		sendToServer($chatInput.val());
		postStatus("You: " + $chatInput.val());
		$chatInput.val('');
		return false;
	});
	
	$('#ready-game-button').click(function(){
		localUserPawns.ready = true;
		$(this).hide();
		sendToServer(JSON.stringify(localUserPawns));
		if (remoteUserPawns === false) {
			$('#ready-message').show();
		} else{
			startGame();
		}
		
	});
	
	if ( remoteStatus == 'invite' ) {
		$('#status-box').append('<p>Invite a friend with this link: ' + document.URL + '</p>')
			.append('<p>You will be notified when your friend arrives</p>');
		
		$('#share-link-p .share-input').val(document.URL).select();
		$.fancybox({
			'href' : '#invite-popup',
			'closeBtn' : false
		});
	}
});

function postStatus(m) { 
	var d = new Date();
	var time = ('0' + d.getHours()).slice(-2) + ':'
    	+ ('0' + d.getMinutes()).slice(-2);
	var $statusBox = $('#status-box');
	$statusBox.append('<p>' + time + ' - ' + m + '</p>');
	$statusBox.scrollTop( 10000 );     
}


function setCellSize() {
	var windowSize = getWindowSize();
	var minScale = Math.min(windowSize[0], windowSize[1]);
	var cellSize = Math.floor(minScale / width);
	$('td').height(cellSize - 1).width(cellSize - 1);
	$('table').width(minScale + width);
}

function startLayout() {
	// initialize the local user pawns
	localUserPawns = new pawnSet();
	$pawnsBox = $('#all-pawns-start');
	for (var i=0; i < localUserPawns.pawns.length; i++) {
		$pawnsBox.append ( localUserPawns.pawns[i].createForPawnBox() );
	}
	
	// for setting the local board, disable the top table
	$('td').slice(0, 450).addClass('td-disabled');
}

function showReady() {
	$('#ready-game').show();
	$('#all-pawns-start').hide();
}

function startGame() {
	gameState = 'inprogress'
	$('#ready-game').hide();
	
	// first set the opponent's board
	$('td.td-disabled').droppable( "option", "disabled", false );
	$('.td-disabled').removeClass('td-disabled');
	var posx, posy, img;
	for (var i=0; i < remoteUserPawns.pawns.length; i++) {
		posx = width - remoteUserPawns.pawns[i].posX - 1;
		posy = height - remoteUserPawns.pawns[i].posY - 1;
		id = remoteUserPawns.pawns[i].id;
		img = '<img class="pawn-img pawn-img-remote" src="/static/images/white.png" id="remote-pawn-' +id+ '" />';
		$("td#td" + posx + "x" + posy).append( img );
	}
	
	// start the turns
	whoseTurn = (remoteStatus == 'invite') ? ('remote') : ('local');
	$('#game-status').show().addClass(whoseTurn);
	
	// enable/disable the pawns
	if ( whoseTurn == 'remote' ) {
		disablePawns (true);
	}
}

function disablePawns (which) {
	$( ".pawn-img-draggable" ).draggable( "option", "disabled", which);
}

function movePawn (id, posx, posy) {
	whoseTurn = 'remote';
	disablePawns (true);
	$('#game-status').addClass(whoseTurn);
	sendToServer( "move/"+ id + "/" + posx + "/" + posy ); 
	$('.justmoved').removeClass('justmoved');
}

function remoteMove (data) {
	whoseTurn = 'local';
	disablePawns (false);
	$('#game-status').removeClass('remote');
	var $pawn = $('#remote-pawn-' + data[2]);
	$pawn.parent().addClass('justmoved');
	var $newTD = $('#td' + reversePos(data[3]) + 'x' + reversePos(data[4])).addClass('justmoved');
	$pawn.appendTo( $newTD );
}