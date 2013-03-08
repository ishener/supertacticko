var zoom = 0;
var newGame = true;
var localUserPawns;

$(function() {
	
	setCellSize();
	$(window).resize(function() {
		setCellSize();
	});
	if (newGame) startLayout();
	$( ".pawn-img" ).draggable({ 
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
			ui.helper.width( 40 ).height( 'auto' );
		}
	});
	$('td:not(.td-disabled)').droppable({
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
	        if ($('.pawn-box:visible').length == 0) {
	        	// finished placing pawns. show ready button
	        	$('#ready-game').show();
	        	$('#all-pawns-start h2').html('Review your board, and click ready');
	        }
	    }
	});
	
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
	$('.create-page td').click(function() {
		var row = $(this).attr('posx');
		var col = $(this).attr('posy');
		var mirrorRow = width - 1 - row;
		if ( mapData[row][col] === 1 ) {
			mapData[row][col] = 0;
			$('#'+mirrorRow + 'x' + col).removeClass('land-td');
			mapData[mirrorRow][col] = 0;
			$(this).removeClass('land-td');
		} else {
			mapData[row][col] = 1;
			$(this).addClass('land-td');
			$('#'+mirrorRow + 'x' + col).addClass('land-td');
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
});



function setCellSize() {
	var windowSize = getWindowSize();
	var minScale = Math.min(windowSize[0], windowSize[1]);
	var cellSize = Math.floor(minScale / width);
	$('td').height(cellSize - 1).width(cellSize - 1);
	$('table').width(minScale + width);
}

function getWindowSize() {
	var winW = 630, winH = 460;
	if (document.body && document.body.offsetWidth) {
	 winW = document.body.offsetWidth;
	 winH = document.body.offsetHeight;
	}
	if (document.compatMode=='CSS1Compat' &&
	    document.documentElement &&
	    document.documentElement.offsetWidth ) {
	 winW = document.documentElement.offsetWidth;
	 winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
	 winW = window.innerWidth;
	 winH = window.innerHeight;
	}

	return [winW,winH];
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
//	$('td').slice(450).css('background-color', 'black')
}