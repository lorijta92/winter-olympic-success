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
            title:'Population vs. Medals',
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
};
  
// Call the init() function
init();