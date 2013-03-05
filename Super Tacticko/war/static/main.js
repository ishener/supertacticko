
$(function() {
	
	setCellSize();
	$(window).resize(function() {
		setCellSize();
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
	$('td').height(cellSize - 1);
	$('table').width(minScale + width*5);
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