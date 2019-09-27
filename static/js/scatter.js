// Import dataframe-js to filter data
var DataFrame = dfjs.DataFrame;
// import DataFrame from "dataframe-js";

const df = new DataFrame([
  {c1: 1, c2: 6},
  {c4: 1, c3: 2}
], ['c1', 'c2', 'c3', 'c4']);

// Set up SVG
// var svgWidth = 740;
// var svgHeight = 400;

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 50,
//   left: 60
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create SVG wrapper, append SVG group to hold chart & shift by left and top margins.
// var svg = d3
//   .select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// // Append an SVG group
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Retrieve data and execute everything below
// var url = "/gdp_medals";

// d3.json(url).then(function(olympicData) {

//   console.log(olympicData);

//   // bronze, country, game, gdp, gold, silver, year
//   var colnames = Object.keys(olympicData[0]);
//   console.log(colnames);

//   // Filter data
//   const completeDF = new DataFrame(olympicData, colnames);

//   var winterDF = completeDF
//     .filter(row => row.get("game") === "winter")
//     .select("bronze", "country", "gdp", "gold", "silver", "year");

//   winterDF.show(3);



  // Parse data
  // olympicData.forEach(function(d) {
  //   d.year = +d.year;
  //   d.gold = +d.gold;
  //   d.silver = +d.silver;
  //   d.bronze = +d.bronze;
  //   d.gdp = parseFloat(d.gdp);
  // });

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