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
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
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

// Update y-scale upon click on axis label
function yScale(olympicData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(olympicData, d => d[chosenYAxis]),
      d3.max(olympicData, d => d[chosenYAxis])
    ])
    .range([height, 0]);

  return yLinearScale;

}

// Update y-axis upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// Update circles group with a transition to new circles
function renderCircles(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// Update circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {

  if (chosenYAxis === "gold") {
    var label = "Gold Medals:";
  }
  else if (chosenYAxis === "silver") {
    var label = "Silver Medals:";
  }
  else {
    var label = "Bronze Medals:";
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

  // Parse data
  olympicData.forEach(function(d) {
    d.year = +d.year;
    d.gold = +d.gold;
    d.silver = +d.silver;
    d.bronze = +d.bronze;
    d.gdp = parseFloat(d.gdp);
  });

  // yLinearScale function above json import
  var yLinearScale = yScale(olympicData, chosenYAxis);

  // Create x scale function
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

  // Create group for  3 y-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var goldMedals = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "gold") // value to grab for event listener
    .classed("active", true)
    .text("Gold Medals");

  var silverMedals = labelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("value", "silver") // value to grab for event listener
  .classed("inactive", true)
    .text("Silver Medals");

    var bronzeMedals = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "bronze") // value to grab for event listener
    .classed("inactive", true)
    .text("Bronze Medals");

  // append x axis
  chartGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .text("Year");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above json import
        // updates x scale for new data
        yLinearScale = yScale(olympicData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "gold") {
          goldMedals
            .classed("active", true)
            .classed("inactive", false);
          silverMedals
            .classed("active", false)
            .classed("inactive", true);
          bronzeMedals
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "silver") {
          goldMedals
            .classed("active", false)
            .classed("inactive", true);
          silverMedals
            .classed("active", true)
            .classed("inactive", false);
          bronzeMedals
            .classed("active", false)
            .classed("inactive", true);
        }        
        else {
          goldMedals
            .classed("active", false)
            .classed("inactive", true);
          silverMedals
            .classed("active", false)
            .classed("inactive", true);
          bronzeMedals
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});
