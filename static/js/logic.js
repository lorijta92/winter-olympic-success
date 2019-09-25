/////////////////////////////////////////////////
// Choropleth Map
/////////////////////////////////////////////////

// Render Choropleth Map
var mapboxAccessToken = API_KEY
var myGeoJSONPath = 'static/json/countries_geoJSON.json'; //custom.geo.json
var myCustomStyle = {
    stroke: false,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
};

// Link to country GeoJSON
var geoJSONLink = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

var map = L.map('map').setView([25.0, 5.0], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
	id: 'mapbox.light',
	// attribution: ...
}).addTo(map);

d3.json(geoJSONLink, function(data) {
    L.geoJson(data).addTo(map);
});

function getColor(d) {
    // #ffd700,#ffe26b,#ffeca3,#fff6d3,#ffffff

    if d > 1000 {
        return '#ffd700';
    } 
    else if d > 500 {
        return '#ffe26b';
    }
    else if d > 250 {
        return '#ffeca3';
    }
    else if d > 100 {
        return '#fff6d3';
    }
    else {
        return '#ffffff';
    }
};

function style(feature) {
	return {
		fillColor: getColor(),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
};


// d3.json(myGeoJSONPath,function(data){
    

//     L.geoJson(data, {
//         clickable: false,
//         style: myCustomStyle
//     }).addTo(map);
// });


/////////////////////////////////////////////////
// Plotly Line Graph
/////////////////////////////////////////////////

// Define a function that takes country_code, a dictionary structured
// like our response object, and toggle parameter between population and medals
//  as input and outputs x and y data
// function xyData(country, dictionary, ytype) {
    

//     return [x, y]
// };

function lineGraph() {

    // Define the url described in app.py
    var url = "/line_graph";
  
    // Grab the json from that url and utilize it to build the line graph
    d3.json(url).then(function(response) {

      // Log the response
      console.log(response);
  
    //   // Loop through key, value pairs to populate metadata list
    //   for (let [key, value] of Object.entries(response)) {
    //     data.push({
    //       key: key,
    //       value: value
    //     });
    //   };
      
    //   // Define trace for the population line graph with AUT as the placeholder
    //   var pop_trace = {
    //     x: xyData('AUT', response, population)[0],
    //     y: xyData('AUT', response, population)[1],
    //     mode: 'line',
    //     name: 'Population',
    //     line: {
    //        color: 'rgb(55, 128, 191)',
    //        width: 3
    //     }
    //   };
      
    //   // Define trace for the olympic medals line graph
    //   var medals_trace = {
    //     x: xyData('AUT', response, medals)[0],
    //     y: xyData('AUT', response, medals)[1],
    //     mode: 'line',
    //     name: 'Medals',
    //     line: {
    //        color: 'rgb(55, 128, 191)',
    //        width: 3
    //     }
    //   };

    //   // Define layout for the line graph
    //     var layout = {
    //         title:'Medals vs. Population'
    //     };
      
    //   // Define full trace for line graph
    //   var full_trace = [pop_trace, medal_trace];
      
    //   Plotly.newPlot('line', full_trace, layout);
    });
  };

//lineGraph();






