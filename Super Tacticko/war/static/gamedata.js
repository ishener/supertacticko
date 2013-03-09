
/* initial data for the pawns
 * 0: name of the pawn
 * 1: how many of that pawn for a player
 */
var pawnData = [
    ["private", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["corporal", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["sergeant", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["captain", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["major", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["commander", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["colonel", 2, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["brigadier", 1, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["general", 1, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["landmine", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?'],
    ["seamine", 3, 'dummy description. Nec elementum turpis aliquet tristique mid lectus velit? Habitasse, hac dapibus scelerisque, magna risus, tincidunt habitasse nascetur magna, enim proin?']
]

function Pawn(id, name) {
	this.id = id;
	this.name = name;
	this.posX = -1;
	this.posY = -1;
	
	this.createForPawnBox = function () {
		var str = '<div class="pawn-box" id="pawn-box-' + this.id + '">';
		str += 	  	'<img class="pawn-img pawn-img-draggable" src="/static/images/' + this.name + '.png" id="pawn-' + 
					this.id + '" serial="' + this.id + '" />';
		str +=		'<p class="pawn-name">' + this.name + '</p>';
		str +=		'<p class="pawn-desc">' + pawnData[0][2] + '</p>'; // TODO: fix the description
		str += 	  '</div>';
		return str;
	}
	
	this.setPos = function (x, y) {
		this.posX = x;
		this.posY = y;
	}
}

function pawnSet() {
	this.ready = false;
	this.pawns = new Array();
	var c = 0;
	for ( var i=0; i < pawnData.length; i++ ) {
		for ( var j=0; j < pawnData[i][1]; j++ ) {
			this.pawns.push ( new Pawn (c++, pawnData[i][0]) );
		}
	}
}
 