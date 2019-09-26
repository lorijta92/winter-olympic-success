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




/////////////////////////////////////////////////
// SCATTER PLOT
/////////////////////////////////////////////////
var svgWidth = 860;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
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

// Initial Params
// var chosenXAxis = "year"; // CONDITIONAL SELECT ON GAME
var chosenYAxis = "gold";

// Function to update x-scale var upon click on axis label
// function xScale(olympicData, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(olympicData, d => d[chosenXAxis]) * 0.8,
//       d3.max(olympicData, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }

// Function to update y-scale var upon click on axis label
function yScale(olympicData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(olympicData, d => d[chosenYAxis]) * 0.8,
      d3.max(olympicData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// Function to update y-axis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// Function to update circles group with a transition to new circles
function renderCircles(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXYAxis, circlesGroup) {

  if (chosenYAxis === "gold") {
    var label = "Gold:";
  }
  else if (chosenYAxis === "silver") {
    var label = "Silver";
  }
  else {
    var label = "Bronze";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.country}<br>${label} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
var url = "/gdp_medals";

d3.json(url).then(function(err, olympicData) {
  if (err) throw err;
  
  console.log(olympicData);

  // parse data
  olympicData.forEach(function(d) {
    d.year = +d.year;
    d.gold = +d.gold;
    d.silver = +d.silver;
    d.bronze = +d.bronze;
    d.gdp = parseFloat(d.gdp);
  });

  // xLinearScale function above csv import
  var yLinearScale = yScale(olympicData, chosenYAxis);

  // Create y scale function
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(olympicData, d => d.year), d3.max(olympicData, d => d.year)])
    .range([0, width]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(olympicData)
    .enter()
    .append("circle")
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("cx", d => xLinearScale(d.year))
    .attr("r", d => d.gdp/100)
    .attr("fill", "blue")
    .attr("opacity", ".5");
});