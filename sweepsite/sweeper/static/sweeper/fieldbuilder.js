var CELL_PIXELS = 25;
var TEXT_VERTICAL_OFFSET = CELL_PIXELS / 2 - 8;
var GREEN1 = '#339933';
var GREEN2 = '#ccff99';
var PURPLE = '#8342f4';
var BLACK = '#000';
var RED = '#ff0000';

function drawText(svg, x, y, txt) {
	svg.text(txt.toString()).attr('text-anchor', "middle").move(x*CELL_PIXELS+CELL_PIXELS/2,y*CELL_PIXELS+TEXT_VERTICAL_OFFSET);
}

function drawTile(svg, x, y, content) {
	var colour = BLACK;
	if(content === null) colour = GREEN1;
	if(content === "F") colour = PURPLE;
	if(content === "M") colour = BLACK;
	if($.isNumeric(content)) {
		svg.rect(CELL_PIXELS,CELL_PIXELS).move(x*CELL_PIXELS,y*CELL_PIXELS).fill(GREEN2).stroke({ color: BLACK, width: 1 });
		if(content > 0 ) {
			drawText(svg, x, y, content);
		}
	} else {
		svg.rect(CELL_PIXELS,CELL_PIXELS).move(x*CELL_PIXELS,y*CELL_PIXELS).fill(colour).stroke({ color: BLACK, width: 1 });
	}
}

function initialize() {
	var _csrftoken = $("[name=csrfmiddlewaretoken]").val();
	$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", _csrftoken);
        }
    }
	});

	var svg = SVG('svgElement').size(sweeper_boardWidth * CELL_PIXELS, sweeper_boardHeight * CELL_PIXELS);
	for(var x=0;x<sweeper_boardWidth;x++) {
		for(var y=0;y<sweeper_boardHeight;y++) {
			var tileContent = sweeper_jsonBoard[x][y];
			drawTile(svg,x,y,tileContent);
		}
	}
	
	svg.mouseover(function(evt){
		if(evt.target.nodeName !== "rect") {
			return true;
		}
		var x = evt.target.getAttribute('x') / CELL_PIXELS;
		var y = evt.target.getAttribute('y') / CELL_PIXELS;
		if(sweeper_jsonBoard[x][y] === null) {
			evt.target.setAttribute('fill', GREEN2);
		}
	});
	
	svg.mouseout(function(evt){
		if(evt.target.nodeName !== "rect") {
			return true;
		}
		var x = evt.target.getAttribute('x') / CELL_PIXELS;
		var y = evt.target.getAttribute('y') / CELL_PIXELS;
		if(sweeper_jsonBoard[x][y] === null) {
			evt.target.setAttribute('fill', GREEN1);
		}
	});
	
	svg.click(function(evt){
		if(evt.target.nodeName !== "rect") {
			return true;
		}
		var x = evt.target.getAttribute('x') / CELL_PIXELS;
		var y = evt.target.getAttribute('y') / CELL_PIXELS;
		
		$.ajax({
			 type:"GET",
			 url:"discover_tile/",
			 data: {'x': x, 'y':y},
			 success: function(response){
					 
					 if($.isNumeric(response)) {
						if(response < 9) {
							sweeper_jsonBoard[x][y] = parseInt(response);
							evt.target.setAttribute('fill', GREEN2);
							drawText(svg, x, y, response);
						}
						else {
							evt.target.setAttribute('fill', RED);
							sweeper_jsonBoard[x][y] = "M";
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
								drawText(svg, tiles[i].x, tiles[i].y, tiles[i].adj);
							}
						}
					 }
			 }
    });
		
	});
	
	// svg.js doesn't support rightclick capture
	$('#svgElement').contextmenu(function(evt) {
		if(evt.target.getAttribute('x') === null) return true;
		var x = evt.target.getAttribute('x') / CELL_PIXELS;
		var y = evt.target.getAttribute('y') / CELL_PIXELS;
		
		if(sweeper_jsonBoard[x][y] !== null && sweeper_jsonBoard[x][y] !== "F") {
			return false;
		}
		var svgTile = $('#svgElement').find("[x='" + x*CELL_PIXELS + "'][y='" + y*CELL_PIXELS + "']");
		
		var flagSetting = sweeper_jsonBoard[x][y] === null;
		if(flagSetting) {
			svgTile[0].setAttribute('fill', PURPLE);
			sweeper_jsonBoard[x][y] = "F";
		} else {
			svgTile[0].setAttribute('fill', GREEN1);
			sweeper_jsonBoard[x][y] = null;
		}
		
		$.ajax({
			type: "POST",
			url:"toggle_flag/",
			data: {'x': x, 'y':y}, // no interesting response from toggling flags
		});
		
		return false;
	});
}

$(function() {initialize()});



