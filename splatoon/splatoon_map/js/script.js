var boxborder = 5;
var line_width = 6;
var line_height = 10;

// When the user clicks the button, open the modal 
btn_onclick = function() {
	// Get the modal
	var modal = document.getElementById("myModal");
	modal.style.display = "block";
	
	var RegionSelect = document.getElementById("RegionSelect");
	var nick = document.getElementById("nick");
	var twitter = document.getElementById("twitter");

	var conferma = document.getElementById("conferma");
	
	c_region_id = RegionSelect.value;
	c_region = RegionSelect.options[RegionSelect.selectedIndex].text
	c_nick = nick.value;
	c_twitter = twitter.value;
	
	if ((c_twitter.length > 1) && (c_twitter.charAt(0) === '@'))
	{
		c_twitter = c_twitter.substring(1);
	}
	
	//console.log(c_region_id);
	//console.log(c_nick);
	//console.log(c_twitter);
	
	if ((c_region_id > 0) && (c_nick.length > 2) && (c_twitter.length > 2))
	{
	conferma.innerHTML=`
Do you confitm to add:
<table>
<tr><td>`+c_region+`</td>
<td>`+c_nick+`</td>
<td>@`+c_twitter+`</td>
</tr>
</table>
<button onclick="conferma_onclick();">Yes</button>&nbsp;<button onclick="span_onclick();">No</button>
`
	} else {
		conferma.innerHTML=`
Complete all fields
<button onclick="span_onclick();">Close</button>
`
	}
}

// Add user
conferma_onclick = function() {
	// Get the modal
	var modal = document.getElementById("myModal");
	modal.style.display = "none";
	
	var RegionSelect = document.getElementById("RegionSelect");
	var nick = document.getElementById("nick");
	var twitter = document.getElementById("twitter");

	var conferma = document.getElementById("conferma");
	conferma.innerHTML="";
	
	c_region = RegionSelect.options[RegionSelect.selectedIndex].text
	c_nick = nick.value;
	c_twitter = twitter.value;
	
	if ((c_twitter.length > 1) && (c_twitter.charAt(0) === '@'))
	{
		c_twitter = c_twitter.substring(1);
	}
	
	//console.log(c_region_id);
	//console.log(c_nick);
	//console.log(c_twitter);
	
	if ((c_region_id > 0) && (c_nick.length > 2) && (c_twitter.length > 2))
	{
		var jsonPostData = JSON.stringify({"region_id": c_region_id, "nick": c_nick, "twitter": c_twitter});
		postJSON('https://www.porcate.org:3021/api/v1/nicks', "callback_args", jsonPostData, function(err, callback_args, jsonData) {
			// JSON result in `data` variable
			if (err !== null) {
				alert('Something went wrong: ' + err);
			} else {
				//console.log(jsonData);
				PopolateMap();

			} // end else
		});

	} else {
		alert("UNEXPECTED ERROR");
	}
}



// When the user clicks on <span> (x), close the modal
span_onclick = function() {
	var modal = document.getElementById("myModal");
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/* getJSON support function */
var getJSON = function(url, callback_args, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    //xhr.responseType = 'text';
	xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = function() {
    
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            callback(null, callback_args, JSON.parse(xhr.responseText));
        } else {
            callback(xhr.status);
        }
    };
    
    xhr.send();
};

/* postJSON support function */
var postJSON = function(url, callback_args, json_data, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload  = function() {
    
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            callback(null, callback_args, JSON.parse(xhr.responseText));
        } else {
            callback(xhr.status);
        }
    };
    
    xhr.send(json_data);
};

/* on click call clicked(evt) */
function clicked(evt){
    var e = evt.target;
    var dim = e.getBoundingClientRect();
    var x = evt.clientX - dim.left;
    var y = evt.clientY - dim.top;
    alert("x: "+x+" y:"+y);
}



/* on load call RunOnLoad() */
function RunOnLoad() {
	PopolateSelect();
	PopolateMap();
}


/* on RunOnLoad call PopolateSelect() */
function PopolateSelect() {


	getJSON('https://www.porcate.org:3021/api/v1/regions?order_by=region', "callback_args",function(err, callback_args ,jsonData) {
	    
	    // JSON result in `data` variable
	    if (err !== null) {
			alert('Something went wrong: ' + err);
	    } else {

			//console.log(jsonData.data.length);

			var regions = jsonData.data;
			//console.log(regions);

			var ele = document.getElementById("RegionSelect");
			
			/* parse result and update RegionSelect */
			for(i = 0; i < regions.length; i++) {
				ele.innerHTML = ele.innerHTML + '<option value="' + regions[i].id + '">' + regions[i].region + '</option>';
			}
			
		} // end else
	});
};


/* on RunOnLoad call PopolateMap() */
function PopolateMap() {

	var layer = document.getElementById("MapLabels");
	layer.innerHTML = '';
	layer.textContent = '';
	
	getJSON('https://www.porcate.org:3021/api/v1/activeregs', "callback_args", function(err, callback_args, jsonData) {
	    
	    // JSON result in `data` variable
	    if (err !== null) {
			alert('Something went wrong: ' + err);
	    } else {

			//console.log(jsonData.data.length);

			var regions = jsonData.data;
			//console.log(regions);
			
			/* parse result and update MapLabels */
			for(i = 0; i < regions.length; i++) {
				
				var region = regions[i];
				//console.log(region);
				
				getJSON('https://www.porcate.org:3021/api/v1/nicks?region_id=' + region.id, region, function(err, region, jsonData) {
			
					// JSON result in `data` variable
					if (err !== null) {
						alert('Something went wrong: ' + err);
					} else {
				
						//console.log(jsonData.data.length);

						var nicks = jsonData.data;
						//console.log(nicks);
						//console.log(region);
						
						// BOX
						var longestnick = (nicks).sort(function (a, b) { return b.nick.length - a.nick.length; })[0];
						var nicks_width = (longestnick.nick.length * line_width) + boxborder * 4;
						var nicks_height = (((nicks).length +1 )* line_height ) + boxborder * 2;
						
						var rectelement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
						rectelement.setAttributeNS(null, 'class', "label_box" );
						rectelement.setAttributeNS(null, 'x', region.x  - boxborder);
						rectelement.setAttributeNS(null, 'y', region.y  - line_height - boxborder);
						rectelement.setAttributeNS(null, 'height', nicks_height );
						rectelement.setAttributeNS(null, 'width', nicks_width );
						
						layer.appendChild(rectelement);
						
						// TEXT
						var textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
						textelement.setAttributeNS(null, 'class', "label_text" );
						textelement.setAttributeNS(null, 'x', region.x);
						textelement.setAttributeNS(null, 'y', region.y);
						
						// TEXT -> TSPAN (Nicks)
						for(t = 0; t < (nicks).length; t++) {
							var nickelement = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
							nickelement.setAttributeNS(null, 'class',  "label_tspan");
							nickelement.setAttributeNS(null, 'x', region.x);
							if (t > 0) {
								nickelement.setAttributeNS(null, 'dy', "1.2em");
							}
							nickelement.innerHTML = '<a href="https://twitter.com/' + nicks[t].twitter + '" target="_blank">' + nicks[t].nick + '</a>';
							textelement.appendChild(nickelement);
						}
						
						layer.appendChild(textelement);

						// ARROW
						var lineelement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
						if ( region.x2 > region.x ) {
							lineelement.setAttributeNS(null, 'x1', region.x - boxborder + nicks_width );
						} else {
							lineelement.setAttributeNS(null, 'x1', region.x - boxborder );
						}
						if ( region.y2 < region.y ) {
							lineelement.setAttributeNS(null, 'y1', region.y - line_height - boxborder );
						} else {
							lineelement.setAttributeNS(null, 'y1', region.y - line_height - boxborder + nicks_height);
						}
						lineelement.setAttributeNS(null, 'x2', region.x2 - boxborder );
						lineelement.setAttributeNS(null, 'y2', region.y2 );
						lineelement.setAttributeNS(null, 'stroke', "#000" );
						lineelement.setAttributeNS(null, 'stroke-width', "1" );
						lineelement.setAttributeNS(null, 'marker-end', "url(#arrow)" );
						
						layer.appendChild(lineelement);
						
						console.log("Image popolated");
					} // end else
				});
			}
		} // end else
	});
};

