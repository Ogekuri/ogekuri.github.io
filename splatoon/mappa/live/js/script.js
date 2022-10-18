var boxborder = 5;
var line_width = 6;
var line_height = 10;

/* getJSON support function */
var getJSON = function(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    
    xhr.onload = function() {
    
        var status = xhr.status;
        
        if (status == 200) {
            callback(null, xhr.responseText);
        } else {
            callback(status);
        }
    };
    
    xhr.send();
};

/* on click call clicked(evt) */
function clicked(evt){
    var e = evt.target;
    var dim = e.getBoundingClientRect();
    var x = evt.clientX - dim.left;
    var y = evt.clientY - dim.top;
    alert("x: "+x+" y:"+y);
}

/* on load call PopolateMap() */
function PopolateMap() {


	getJSON('http://splatoon.porcate.org/mappa/live/populate.php', function(err, data) {
	    
	    // JSON result in `data` variable
	    if (err !== null) {
		alert('Something went wrong: ' + err);
	    } else {

		var jsonData = JSON.parse(data);
		//console.log(jsonData.regions.length);

		var regions = jsonData.regions;
		for (var i = 0; i < jsonData.regions.length; i++) {
		    var region = jsonData.regions[i];
		    //console.log(region.region);
		    for (var t = 0; t < region.nicks.length; t++) {
			    var nick = region.nicks[t];
			    //console.log(nick);
			}
		    }

	

	var layer = document.getElementById("MapLabels");
	
	/* parse result and update MapLabels */
	for(i = 0; i < regions.length; i++) {
	
		// BOX
		var longestnick = (regions[i].nicks).sort(function (a, b) { return b.length - a.length; })[0];
		var nicks_width = (longestnick.length * line_width) + boxborder * 2;
		var nicks_height = (((regions[i].nicks).length +1 )* line_height ) + boxborder * 2;
		
		var rectelement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		rectelement.setAttributeNS(null, 'class', "label_box" );
		rectelement.setAttributeNS(null, 'x', regions[i].x  - boxborder);
		rectelement.setAttributeNS(null, 'y', regions[i].y  - line_height - boxborder);
		rectelement.setAttributeNS(null, 'height', nicks_height );
		rectelement.setAttributeNS(null, 'width', nicks_width );
		
		layer.appendChild(rectelement);
		
		// TEXT
		var textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		textelement.setAttributeNS(null, 'class', "label_text" );
		textelement.setAttributeNS(null, 'x', regions[i].x);
		textelement.setAttributeNS(null, 'y', regions[i].y);
		
		// TEXT -> TSPAN (Nicks)
		for(t = 0; t < (regions[i].nicks).length; t++) {
			var nickelement = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
			nickelement.setAttributeNS(null, 'class',  "label_tspan");
			nickelement.setAttributeNS(null, 'x', regions[i].x);
			if (t > 0) {
				nickelement.setAttributeNS(null, 'dy', "1.2em");
			}
			nickelement.innerHTML = regions[i].nicks[t];
			textelement.appendChild(nickelement);
		}
		
		layer.appendChild(textelement);

		// ARROW
		var lineelement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		if ( regions[i].x2 > regions[i].x ) {
		    lineelement.setAttributeNS(null, 'x1', regions[i].x - boxborder + nicks_width );
		} else {
		    lineelement.setAttributeNS(null, 'x1', regions[i].x - boxborder );
		}
		if ( regions[i].y2 < regions[i].y ) {
		    lineelement.setAttributeNS(null, 'y1', regions[i].y - line_height - boxborder );
		} else {
		    lineelement.setAttributeNS(null, 'y1', regions[i].y - line_height - boxborder + nicks_height);
		}
		lineelement.setAttributeNS(null, 'x2', regions[i].x2 - boxborder );
		lineelement.setAttributeNS(null, 'y2', regions[i].y2 );
		lineelement.setAttributeNS(null, 'stroke', "#000" );
		lineelement.setAttributeNS(null, 'stroke-width', "1" );
		lineelement.setAttributeNS(null, 'marker-end', "url(#arrow)" );
		
		layer.appendChild(lineelement);
		
		console.log("Image popolated");
	}

		} // end else
	});
};

