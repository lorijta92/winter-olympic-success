// Set up SVG
var svgWidth = 930;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 10,
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

// Set default values
var chosenYAxis = "gold";

// Update y-scale upon click on axis label
function yScaleFunc(olympicData, chosenYAxis) {

  var yScale = d3.scaleLinear()
    .domain([d3.min(olympicData, d => d[chosenYAxis]),
      d3.max(olympicData, d => d[chosenYAxis])
    ])
    .range([height, 0]);

  return yScale;
}

// Update yAxis var upon click on axis label
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

// Set marker color based on medal type
function getColor(chosenYAxis){
  return chosenYAxis === "gold" ? "#ffd829":
    chosenYAxis === "silver" ? "#b3b3b3" :
      "#804A00";
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {

  if (chosenYAxis === "gold") {
    var label = "Gold Medals:";
  }
  else if (chosenYAxis === "silver") {
    var label = "Silver Medals:"
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

// Retrieve data and execute everything below
var url = "/gdp_medals";

d3.json(url).then(function(olympicData) {

  console.log(olympicData);

  // Parse data
  // olympicData.forEach(function(d) {
  //   d.year = +d.year;
  //   d.gold = +d.gold;
  //   d.silver = +d.silver;
  //   d.bronze = +d.bronze;
  //   d.gdp = parseFloat(d.gdp);
  // });

  // Set scales
  var yScale = yScaleFunc(olympicData, chosenYAxis);

  // Create y scale function
  var xScale = d3.scaleLinear()
    .domain([d3.min(olympicData, d => d.year), d3.max(olympicData, d => d.year)])
    .range([0, width]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

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
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.chosenYAxis))
    .attr("r", d => d.gdp/4000)
    .attr("fill", getColor(chosenYAxis))
    .attr("opacity", ".5");

  // Create group for  3 y-axis labels
  var  ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-50, ${height / 2})`);

  // The following three variables store the properties of each x-axis label
  var goldMedals = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", -110)
    .attr("dy", "1.5em")
    .attr("font-size", "12px")
    .attr("value", "gold")
    .classed("active", true)
    .text("Gold Medals");

  var silverMedals = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0)
    .attr("dy", "1.5em")
    .attr("font-size", "12px")
    .attr("value", "silver")
    .classed("inactive", true)
    .text("Silver Medals");

  var bronzeMedals = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 110)
    .attr("dy", "1.5em")
    .attr("font-size", "12px")
    .attr("value", "bronze")
    .classed("inactive", true)
    .text("Bronze Medals");

  // append x axis
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 50})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Year");

  // updateToolTip
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // x axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yScale = yScale(olympicData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderAxes(yScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, yScale, chosenYAxis);

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

  // // Set scales
  // var yScale = d3.scaleLinear()
  //   .domain([0, d3.max(olympicData, d => d.gold)])
  //   .range([height, 0]);

  // var xScale = d3.scaleLinear()
  //   .domain([d3.min(olympicData, d => d.year), d3.max(olympicData, d => d.year)])
  //   .range([0, width]);

  // // Create initial axis functions
  // var bottomAxis = d3.axisBottom(xScale);
  // var leftAxis = d3.axisLeft(yScale);

  // // append x axis
  // chartGroup.append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(bottomAxis);

  // // append y axis
  // chartGroup.append("g")
  //   .call(leftAxis);

  // // append initial circles
  // chartGroup.selectAll("circle")
  //   .data(olympicData)
  //   .enter()
  //   .append("circle")
  //   .attr("cy", d => yScale(d.gold))
  //   .attr("cx", d => xScale(d.year))
  //   .attr("r", d => d.gdp / 4000)
  //   .attr("fill", "#ffd829")
  //   .attr("opacity", ".5")
  //   .attr("class", "circle");

  // // Label x-axis
  // chartGroup.append("text")
  //     .attr("transform", `translate(${width / 2}, ${height + 40})`)
  //     .attr("text-anchor", "middle")
  //     .attr("font-size", "12px")
  //     .attr("font-weight", "bold")
  //     .text("Year");
  
  // // Label y-axis
  // chartGroup.append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("x", 0 - (height/2))
  //     .attr("y", 0 - margin.left)
  //     .attr("dy", "1em")
  //     .attr("text-anchor", "middle")
  //     .attr("font-size", "12px")
  //     .attr("font-weight", "bold")
  //     .text("Gold Medals");
// });