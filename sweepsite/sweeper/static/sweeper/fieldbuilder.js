var CELL_PIXELS = 25;

function initialize() {
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');
	ctx.textAlign="center"; 
	ctx.textBaseline="middle";
	canvas.width = sweeper_boardWidth * CELL_PIXELS;
	canvas.height = sweeper_boardHeight * CELL_PIXELS;
	
	for(var x=0;x<sweeper_boardWidth;x++) {
		for(var y=0;y<sweeper_boardHeight;y++) {
			ctx.rect(x*CELL_PIXELS,y*CELL_PIXELS,CELL_PIXELS,CELL_PIXELS);
			var tileContent = sweeper_jsonBoard[x][y];
			if(tileContent == "F") {
				ctx.fillText(tileContent, x*CELL_PIXELS+CELL_PIXELS/2,y*CELL_PIXELS+CELL_PIXELS/2);
			}
			if(tileContent == "M") {
				ctx.fillText(tileContent, x*CELL_PIXELS+CELL_PIXELS/2,y*CELL_PIXELS+CELL_PIXELS/2);
			}
			if($.isNumeric(tileContent)) {
				ctx.fillText(tileContent, x*CELL_PIXELS+CELL_PIXELS/2,y*CELL_PIXELS+CELL_PIXELS/2);
			}
		}
	}
	ctx.stroke();
	
}

$(function() {initialize()});

$('#myCanvas').hover(function() {
console.log("hovering");
},
function() {
console.log("narp");
});

