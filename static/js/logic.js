/////////////////////////////////////////////////
// Choropleth Map
/////////////////////////////////////////////////

// Render Choropleth Map
var mapboxAccessToken = API_KEY
var myGeoJSONPath = 'http://127.0.0.1:5000/static/json/countries.json'; //custom.geo.json
var myCustomStyle = {
    stroke: false,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
};

var json = GEO_JSON
console.log(json)

// Link to country GeoJSON
var geoJSONLink = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

var map = L.map('map').setView([25.0, 5.0], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
	id: 'mapbox.light',
	// attribution: ...
}).addTo(map);

// Add geojson data to map
// L.geoJson(json).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h5>Gold Medals per Year</h5>' +  (props ?
        '<b>' + props.name + '</b><br />' + 'gold medals: ' + props.gold
        : '<h6>Hover over a country<h6>');
};

info.addTo(map);


function getColor(d) {
    // #ffd700,#ffe26b,#ffeca3,#fff6d3,#ffffff

    if (d > 10) {
        return '#ffd700';
    } 
    else if (d > 5) {
        return '#ffe26b';
    }
    else if (d > 3) {
        return '#ffeca3';
    }
    else if (d > 1) {
        return '#fff6d3';
    }
    else {
        return '#ffffff';
    }
};

function style(feature) {
	return {
		fillColor: getColor(feature.properties.gold),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
};

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
}

// L.geoJson(json, {style: style}).addTo(map);

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(json, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

slider = L.control.slider(function(value) {
    console.log(value);
}, {
    max: 6,
    value: 5,
    step:0.1,
    size: '250px',
    orientation:'horizontal',
    position: 'bottomright',
    id: 'slider'
}).addTo(map);


/////////////////////////////////////////////////
// Plotly Line Graph
/////////////////////////////////////////////////

// Define a function that takes in a country_code, a dictionary structured
// like our response object, and an argument dictating whether to graph population
// or medals. Outputs x and y data for line graph plotting.

function xyData(countryCode, dictionary, yDataType) {
    
    // Define a variable for the data array for the specified country
    var country_data = dictionary[countryCode];

    // Define an x data array which holds the x-values (i.e., years) for the country's line graph
    var x = country_data.map(element => element.year);

    // Define conditional to set the y data array based on the yDataType argument
    if (yDataType == 'population') {
        var y = country_data.map(element => element.pop_percentage);
    }
        
    else if (yDataType == 'medals') {
        var y = country_data.map(element => element.medal_percentage);
    };

    // Return an array where the first element is the x-data and the second is the y-data. Each 
    // element is an array.
    return [x, y];
};

// Define a function that utilizes our response object from app.py AND the xyData() 
// function defined above to plot our line graph.

function lineGraph() {

    // Define the url described in app.py
    var url = "/line_graph";
  
    // Grab the json from that url and utilize it to build the line graph
    d3.json(url).then( function(response) {

      // Log the response to confirm it's in the same format I expect it to be in
      console.log(response);
      
      // Define trace for the population line graph with AUT as the placeholder
      var pop_trace = {
        x: xyData(countryCode='AUT', dictionary=response, yDataType='population')[0],
        y: xyData(countryCode='AUT', dictionary=response, yDataType='population')[1],
        mode: 'line',
        name: 'Population',
        line: {
           color: '#237BB8',
           width: 2
        }
      };
      
      // Define trace for the olympic medals line graph
      var medals_trace = {
        x: xyData(countryCode='AUT', dictionary=response, yDataType='medals')[0],
        y: xyData(countryCode='AUT', dictionary=response, yDataType='medals')[1],
        mode: 'line',
        name: 'Medals',
        line: {
           color: '#23B8B1',
           width: 2
        }
      };

      // Define layout for the line graph
        var layout = {
            title:'Medal vs. Population Percentages',
            yaxis: {
              tickformat: ',.2%'
            }
        };
      
      // Define the full trace for line graph
      var full_trace = [pop_trace, medals_trace];
      
      // Plot the line graph
      Plotly.newPlot('line', full_trace, layout);
    });
  };

lineGraph();

