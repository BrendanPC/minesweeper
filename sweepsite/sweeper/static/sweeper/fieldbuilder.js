var CELL_PIXELS = 25;
var GREEN1 = '#339933';
var GREEN2 = '#ccff99';
var BLACK = '#000';
var RED = '#ff0000';

function initialize() {
	var svg = SVG('svgElement').size(sweeper_boardWidth * CELL_PIXELS, sweeper_boardHeight * CELL_PIXELS);
	console.log("ee5e");
	for(var x=0;x<sweeper_boardWidth;x++) {
		for(var y=0;y<sweeper_boardHeight;y++) {
			var tileContent = sweeper_jsonBoard[x][y];
			if(tileContent == null) {
				var currentTile = svg.rect(CELL_PIXELS,CELL_PIXELS).move(x*CELL_PIXELS,y*CELL_PIXELS).fill(GREEN1).stroke({ color: BLACK, width: 1 });
			}
			
			if(tileContent == "F") {
				var currentTile = svg.rect(CELL_PIXELS,CELL_PIXELS).move(x*CELL_PIXELS,y*CELL_PIXELS).fill(RED).stroke({ color: BLACK, width: 1 });
				svg.text('F');
			}
			if(tileContent == "M") {
				var currentTile = svg.rect(CELL_PIXELS,CELL_PIXELS).move(x*CELL_PIXELS,y*CELL_PIXELS).fill(BLACK).stroke({ color: BLACK, width: 1 });
			}
			if($.isNumeric(tileContent)) {
			var currentTile = svg.rect(CELL_PIXELS,CELL_PIXELS).move(x*CELL_PIXELS,y*CELL_PIXELS).fill(GREEN2).stroke({ color: BLACK, width: 1 });
				if(tileContent > 0 ) {
					svg.text(tileContent.toString()).move(x*CELL_PIXELS,y*CELL_PIXELS);
				}
			}
		}
	}
	
	svg.mouseover(function(evt){
		var x = evt.target.getAttribute('x') / CELL_PIXELS;
		var y = evt.target.getAttribute('y') / CELL_PIXELS;
		if(sweeper_jsonBoard[x][y] === null) {
			evt.target.setAttribute('fill', GREEN2);
		}
	});
	
	svg.mouseout(function(evt){
		var x = evt.target.getAttribute('x') / CELL_PIXELS;
		var y = evt.target.getAttribute('y') / CELL_PIXELS;
		if(sweeper_jsonBoard[x][y] === null) {
			evt.target.setAttribute('fill', GREEN1);
		}
	});
	
	svg.click(function(evt){
		var x = evt.target.getAttribute('x') / CELL_PIXELS;
		var y = evt.target.getAttribute('y') / CELL_PIXELS;
		if(sweeper_jsonBoard[x][y] === null) {
			evt.target.setAttribute('fill', RED);
		}
		
		$.ajax({
			 type:"GET",
			 url:"discover_tile/",
			 data: {'x': x, 'y':y},
			 success: function(response){
					 sweeper_jsonBoard[x][y] = parseInt(response);
					 if($.isNumeric(response)) {
						if(response < 9) {
							evt.target.setAttribute('fill', GREEN2);
							svg.text(response.toString()).move(x*CELL_PIXELS,y*CELL_PIXELS);
						}
						else {
							evt.target.setAttribute('fill', RED);
						}
					 }
					 else {
						var tiles = $.parseJSON(response);
						console.log(tiles);
						for(var i=0;i<tiles.length;i++) {
							sweeper_jsonBoard[tiles[i].x][tiles[i].y] = tiles[i].adj;
							var svgTile = $('#svgElement').find("[x='" + tiles[i].x*CELL_PIXELS + "'][y='" + tiles[i].y*CELL_PIXELS + "']");
							svgTile[0].setAttribute('fill', GREEN2);
							if(tiles[i].adj > 0) {
								svg.text(tiles[i].adj.toString()).move(tiles[i].x*CELL_PIXELS,tiles[i].y*CELL_PIXELS);
							}
						}
					 }
			 }
    });
		
	});
}

$(function() {initialize()});



