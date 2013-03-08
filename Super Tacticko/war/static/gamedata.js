
/* initial data for the pawns
 * 0: name of the pawn
 * 1: how many of that pawn for a player
 */
var pawnData = [
    ["private", 3],
    ["corporal", 3],
    ["sergeant", 3],
    ["captain", 3],
    ["major", 3],
    ["commander", 3],
    ["colonel", 2],
    ["brigadier", 1],
    ["general", 1],
    ["landmine", 3],
    ["seamine", 3]
]

function Pawn(name) {
	this.name = name;
	this.posX = -1;
	this.posY = -1;
	this.description = 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin? ';
	
	this.createForPawnBox = function () {
		var str = '<div class="pawn-box">';
		str += 	  	'<img src="/static/images/' + this.name + '.png" />';
		str +=		'<p class="pawn-name">' + this.name + '</p>';
		str +=		'<p class="pawn-desc">' + this.description + '</p>';
		str += 	  '</div>';
		return str;
	}
}

function pawnSet() {
	this.pawns = new Array();
	for ( var i=0; i < pawnData.length; i++ ) {
		for ( var j=0; j < pawnData[i][1]; j++ ) {
			this.pawns.push ( new Pawn (pawnData[i][0]) );
		}
	}
}
// just for test
 