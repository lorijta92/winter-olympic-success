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
