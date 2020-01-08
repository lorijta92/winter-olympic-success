// CHART AREA
// ===================================
// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width/2;

// Margin spacing for graph
var margin = 30;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 10;
var tPadLeft = 10;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");


// AXIS LABELS
// ===================================
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
      (height - tPadBot) +
      ")"
  );
}
// Call function
xTextRefresh();

// Append axis labels as svgs to xText
// X-Axis Title
xText
  .append("text")
  .attr("x", 30)
  .attr("y", -15)
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
var leftTextX = -25;
var leftTextY = (height + labelArea) / 2 - (labelArea / 1.5);

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
// Call function
yTextRefresh();

// Append y-label text
yText
  .append("text")
  .attr("y", 50)
  .attr("class", "titleText")
  .text("Count of Medals");


// ACCESS DATA
// ===================================
var url = "/gdp_medals";

d3.json(url).then(function(olympicData) {


  // Create empty arrays to store data for each medal type
  var golds = [];
  var silvers = [];
  var bronzes = [];

  // Iterate through data
  for (var i = 0; i < olympicData.length; i++) {
    var d = olympicData[i];

    // Create a dictionary for each row of gold medal data
    var goldDict = {};
    goldDict['x'] = d.year;
    goldDict['y'] = d.gold;
    goldDict['r'] = d.gdp/3000;
    goldDict['country'] = d.country;
    golds.push(goldDict); // Append 'golds' array with each dictionary

    // Create a dictionary for each row of silver medal data
    var silverDict = {};
    silverDict['x'] = d.year;
    silverDict['y'] = d.silver;
    silverDict['r'] = d.gdp/3000;
    silverDict['country'] = d.country;
    silvers.push(silverDict); // Append 'silvers' array with each dictionary

    // Create a dictionary for each row of bronze medal data
    var bronzeDict = {};
    bronzeDict['x'] = d.year;
    bronzeDict['y'] = d.bronze;
    bronzeDict['r'] = d.gdp/3000;
    bronzeDict['country'] = d.country;
    bronzes.push(bronzeDict); // Append 'bronzes' array with each dictionary
  }


  // Find all unique values for chart axes
  // Empty arrays to store all values 
  var allYears = [];
  var allGolds = [];
  var allSilvers = [];
  var allBronzes = [];

  // Append arrays with respective values
  golds.forEach(d => allYears.push(d.x));
  golds.forEach(d => allGolds.push(d.y));
  silvers.forEach(d => allSilvers.push(d.y));
  bronzes.forEach(d => allBronzes.push(d.y));

  // Function to filter arrays for unique values only
  function uniqueValues(array) {
    return array.filter((item, i, arr) => arr.indexOf(item) === i);
  }

  // Use function to create arrays containing unique values only
  var uniqueYears = uniqueValues(allYears);
  var uniqueGolds = uniqueValues(allGolds);
  var uniqueSilvers = uniqueValues(allSilvers);
  var uniqueBronzes = uniqueValues(allBronzes);

  // Convert uniqueYears array to appropriate data type
  var parseTime = d3.timeParse();
  uniqueYears.forEach(year => parseTime(year));

  // Set scales
  var xScale = d3.scaleTime()
    .domain([d3.min(uniqueYears), d3.max(uniqueYears)])
    .range([0, (width - margin - tPadLeft - 50)]);

  var yScale = d3.scaleLinear()
  .domain([0,d3.max(uniqueGolds)+2])
  .range([height - height/7, 0]);

  // Create axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Bind axes
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(60," + (height - 70) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(60," + (margin - 35) + ")");

}); //d3.json end








// VISUALIZE DATA
// ===================================
function visualize(theData) {
} //visualize end