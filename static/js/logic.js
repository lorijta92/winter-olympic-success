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

    if (d > 1000) {
        return '#ffd700';
    } 
    else if (d > 500) {
        return '#ffe26b';
    }
    else if (d > 250) {
        return '#ffeca3';
    }
    else if (d > 100) {
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

function lineGraph(country) {
  
  // Grab the json from that url and utilize it to build the line graph
  d3.json("/line_graph").then( function(response) {

    // Log the response to confirm it's in the same format I expect it to be in
    console.log(response);
    
    // Define trace for the population line graph with AUT as the placeholder
    var pop_trace = {
      x: xyData(countryCode=country, dictionary=response, yDataType='population')[0],
      y: xyData(countryCode=country, dictionary=response, yDataType='population')[1],
      mode: 'line',
      name: 'Population',
      line: {
          color: '#237BB8',
          width: 2
      }
    };
    
    // Define trace for the olympic medals line graph
    var medals_trace = {
      x: xyData(countryCode=country, dictionary=response, yDataType='medals')[0],
      y: xyData(countryCode=country, dictionary=response, yDataType='medals')[1],
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

// Define a function that initializes the line graph on problem load, and provides
// users with the ability to toggle the country data that is shown.

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selCountrySet");

  var s = {name: "raul", age: "22", gender: "Male"}
   var keys = [];
   for(var k in s) keys.push(k);


  // Use the list of sample names to populate the select options
  d3.json("/line_graph").then(function(response) {
    
    // Build a list of country codes from the keys of the response
    var countryCodes = Object.keys(response);

    // Loop through country codes and append each to the selector variable defined above
    countryCodes.forEach((countryCode) => {
      selector.append("option")
              .text(countryCode)
              .property("value", countryCode);
    });

    // Use the first country code from the list to build the initial line graph
    const firstCountry = countryCodes[0];
    lineGraph(firstCountry);
  });
};

// Define a function that fetches new data each time a new country is selected.

function optionChanged(newCountry) {
  lineGraph(newCountry);
}

// Call the init() function
init();

/////////////////////////////////////////////////
// SCATTER PLOT
/////////////////////////////////////////////////
var svgWidth = 740;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 50,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create SVG wrapper, append SVG group to hold chart & shift by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
var url = "/gdp_medals";

d3.json(url).then(function(olympicData) {

  console.log(olympicData);

  // Parse data
  olympicData.forEach(function(d) {
    d.year = +d.year;
    d.gold = +d.gold;
    d.silver = +d.silver;
    d.bronze = +d.bronze;
    d.gdp = parseFloat(d.gdp);
  });

  // Set scales
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(olympicData, d => d.gold)])
    .range([height, 0]);

  var xScale = d3.scaleLinear()
    .domain([d3.min(olympicData, d => d.year), d3.max(olympicData, d => d.year)])
    .range([0, width]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // append x axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  chartGroup.selectAll("circle")
    .data(olympicData)
    .enter()
    .append("circle")
    .attr("cy", d => yScale(d.gold))
    .attr("cx", d => xScale(d.year))
    .attr("r", d => d.gdp / 4000)
    .attr("fill", "#ffd829")
    .attr("opacity", ".5")
    .attr("class", "circle");

  // Label x-axis
  chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + 40})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Year");
  
  // Label y-axis
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height/2))
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Gold Medals");
});
