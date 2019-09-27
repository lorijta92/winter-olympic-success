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
