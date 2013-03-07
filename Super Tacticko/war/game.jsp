<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,400,700,600' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="/static/style.css">
<link rel="stylesheet" href="/static/fancybox/jquery.fancybox.css?v=2.1.4" type="text/css" media="screen" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min.js"></script>
<script src="/static/jquery.mousewheel.js"></script>
<script>
	var width = ${width};
	var height = ${height};
	var mapData = new Array(${width});
	for ( var i = 0; i < mapData.length; i++ ){
		mapData[i] = new Array(${height});
		for ( var j = 0; j < mapData[i].length; j++ ){
			mapData[i][j] = 0;
		}
	}
</script>
<script src="/static/gamedata.js"></script>
<script src="/static/main.js"></script>
<script type="text/javascript" src="/static/fancybox/jquery.fancybox.pack.js?v=2.1.4"></script>
</head>

<body  class="${bodyClass}">
<table cellpadding="0" width="100%" cellspacing="0">
<c:forEach var="i" begin="0" end="${width-1}">  
	<tr>
		<c:forEach var="j" begin="0" end="${height-1}">  
			<td posx="${i}" posy="${j}" id="${i}x${j}" <c:if test="${map[i][j] == 1}">class="land-td"</c:if>></td>
		</c:forEach>  
	</tr>
</c:forEach>  
</table>
<div id="rightside">
	<button id="save-map" type="button">Save Map</button>
	<div id="all-pawns-start">
		<h2>Drag and drop the pawns in the board.</h2>
	</div>
</div>
<div style="display:none"><div id="created-map">
	<h2>Success!</h2>
	<p>Your map was successfully created.</p>
	<p>To start a game using this map use this link:</p>
	<p id="newmap-p"><a href="#">http://supertacticko.appspot.com/game/</a></p>
	<button onclick="$.fancybox.close()" type="button">Continue Editing</button>
	<button id="save-my-maps" type="button">Save to my maps</button>
</div></div>
</body>
</html>