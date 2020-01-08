// CHART AREA
// ==============
// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width/2;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");


// AXIS LABELS
// ==============
// Create group element to contain x-axis labels
svg.append("g").attr("class", "xText");

// Create xText element to select all x-axis labels as a group
var xText = d3.select(".xText");

// Function for x-axis labels to be responsive to window size
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// Append axis labels as svgs to xText
// X-Axis Title
xText
  .append("text")
  .attr("x", 30)
  .attr("y", -25)
  .attr("class", "titleText")
  .text("Year");

// Gold Medals
xText
  .append("text")
  .attr("x", -100)
  .attr("y", 5)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Gold");
xText
  .append("rect")
  .attr("x", -160)
  .attr("y", -8)
  .attr("width", "30px")
  .attr("height", "15px")
  .style("fill", "rgba(255,221,50,0.4)")
  .style("stroke", "rgba(255,221,50,1)");

// Silver Medals
xText
  .append("text")
  .attr("x", 30)
  .attr("y", 5)
  .attr("data-name", "healthcareLow")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Silver");
xText
  .append("rect")
  .attr("x", -25)
  .attr("y", -8)
  .attr("width", "30px")
  .attr("height", "15px")
  .style("fill", "rgba(74,74,74,0.4)")
  .style("stroke", "rgba(74,74,74,1)");

// Bronze Medals
xText
  .append("text")
  .attr("x", 150)
  .attr("y", 5)
  .attr("data-name", "obesityLow")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Bronze");
xText
  .append("rect")
  .attr("x", 90)
  .attr("y", -8)
  .attr("width", "30px")
  .attr("height", "15px")
  .style("fill", "rgba(128,74,0,0.4)")
  .style("stroke", "rgba(128,74,0,1)");


// Variables for a responsive y-axis label
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// Create group element to contain y-axis labels
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

// Function for y-axis labels to be responsive to window size
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Append y-label text
yText
  .append("text")
  .attr("y", 26)
  .attr("class", "titleText")
  .text("Count of Medals");


// VISUALIZE DATA
// ==============

var url = "/gdp_medals";

d3.json(url).then(function(olympicData) {
    visualize(olympicData);
});