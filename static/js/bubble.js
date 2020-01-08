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

  // Generate chart using Chart.js
  new Chart(document.getElementById("bubble"), {
    type: 'bubble',
    data: {
      labels: ["MEDALS"],
      datasets: [
        {
          label: "Gold",
          backgroundColor: "rgba(255,221,50,0.4)",
          borderColor: "rgba(255,221,50,1)",
          data: golds
        }, {
          label: "Silver",
          backgroundColor: "rgba(74,74,74,0.4)",
          borderColor: "rgba(74,74,74,1)",
          data: silvers
        }, {
          label: "Bronze",
          backgroundColor: "rgba(128,74,0,0.4)",
          borderColor: "rgba(128,74,0,1)",
          data: bronzes
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Relationship Between GDP and Medals Won'
      }, scales: {
        yAxes: [{ 
          scaleLabel: {
            display: true,
            labelString: "Count of Medals"
          }
        }],
        xAxes: [{ 
          scaleLabel: {
            display: true,
            labelString: "Year"
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;

            return 'Year: ' + tooltipItem.xLabel + ' ' + label + ' Medals: ' + tooltipItem.yLabel;
            
         }
        }
      }
    }
  });

}); //d3.json end